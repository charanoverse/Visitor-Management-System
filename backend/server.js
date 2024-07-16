const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const QRCode = require('qrcode');
const extractNumberPlate = require('./extractNumberPlate');
const NumberPlate = require('./model/NumberPlate');
const User = require('./model/User');
const Visitor = require('./model/Visitor');
const VerifiedLog = require('./model/VerifiedLog');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const path = require('path');
const Faces = require('./model/Faces');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());
app.use(fileUpload());

mongoose.connect('mongodb+srv://sricharankolachalama:cherry05@cluster101.qwrvkrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster101', {
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Endpoint to extract number plate
app.post('/api/extractNumberPlate', extractNumberPlate);

// Endpoint to add a new number plate
app.post('/api/addNumberPlate', async (req, res) => {
    const { numberPlateText } = req.body;

    if (!numberPlateText) {
        return res.status(400).send('Number plate text is required.');
    }

    try {
        const existingPlate = await NumberPlate.findOne({ number: numberPlateText });

        if (existingPlate) {
            return res.status(400).send('Number plate already exists.');
        }

        const newPlate = new NumberPlate({ number: numberPlateText });
        await newPlate.save();

        res.json({ message: 'Number plate added successfully' });
    } catch (error) {
        console.error(`Database error: ${error}`);
        res.status(500).send('Database error.');
    }
});

// Endpoint for new visitor registration
app.post('/api/visitor-registration', async (req, res) => {
    const { residentEmail, residentName, visitorName, purpose, relation, date, time } = req.body;

    if (!residentEmail || !residentName || !visitorName || !purpose || !relation || !date || !time) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const qrCodeData = `Visitor: ${visitorName}, Purpose: ${purpose}, Relation: ${relation}, Date: ${date}, Time: ${time}, Resident Email: ${residentEmail}, Resident Name: ${residentName}`;
        const qrCode = await QRCode.toDataURL(qrCodeData);

        const newVisitor = new Visitor({ residentEmail, residentName, visitorName, purpose, relation, date, time, qrCode });
        await newVisitor.save();

        console.log('New visitor registered:', newVisitor);

        res.json({ message: 'Visitor registered successfully', qrCode });
    } catch (error) {
        console.error(`Database error: ${error}`);
        res.status(500).send('Database error.');
    }
});

// Endpoint to fetch scheduled visits for a resident
app.get('/api/visits', async (req, res) => {
    const residentEmail = req.query.residentEmail;

    try {
        const visits = await Visitor.find({ residentEmail: residentEmail });
        res.json({ visits });
    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).send('Database error.');
    }
});

// Endpoint to manage user profile (POST, GET, PUT)
app.post('/api/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/api/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/api/user/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send({ message: 'Update successful', user });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to verify visitor and manage visitor logs
app.post('/api/verifyVisitor', async (req, res) => {
    const { visitorName, purpose, relation, date, time, residentEmail, residentName, scannedAt } = req.body;

    if (!visitorName || !purpose || !relation || !date || !time || !residentEmail || !residentName || !scannedAt) {
        return res.status(400).send('All fields are required.');
    }

    try {
        let visitorLog = await VerifiedLog.findOne({ 
            visitorName, 
            purpose, 
            relation, 
            date, 
            time, 
            residentEmail, 
            residentName 
        });

        if (visitorLog) {
            if (visitorLog.checkOutTime) {
                return res.status(400).send('QR code has already been used for check-out.');
            }
            // Update check out time
            visitorLog.checkOutTime = scannedAt;
            await visitorLog.save();
            res.json({ message: 'Visitor checked out successfully' });
        } else {
            // Add new check in log
            visitorLog = new VerifiedLog({
                visitorName, 
                purpose, 
                relation, 
                date, 
                time, 
                residentEmail, 
                residentName,
                checkInTime: scannedAt,
                checkOutTime: null // Initialize checkOutTime as null
            });
            await visitorLog.save();
            res.json({ message: 'Visitor checked in successfully' });
        }
    } catch (error) {
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Endpoint to fetch visitor logs for all residents
app.get('/api/visitorLogs', async (req, res) => {
    try {
        const logs = await VerifiedLog.find();
        res.json(logs);
    } catch (error) {
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Face detection endpoint
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const loadModels = async () => {
    const MODEL_URL = path.join(__dirname, 'models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
};

loadModels().then(() => {
    app.post('/api/detect', async (req, res) => {
        const { image } = req.body;
        try {
            const newDetection = new Faces({ image });
            await newDetection.save();
            res.json({ message: 'Image stored successfully' });
        } catch (error) {
            console.error(`Database error: ${error}`);
            res.status(500).send('Database error.');
        }
    });

    // Face verification endpoint
    app.post('/api/verify', async (req, res) => {
        const { image } = req.body;
        try {
            const allFaces = await Faces.find();
            if (!allFaces || allFaces.length === 0) {
                return res.status(404).json({ verified: false, message: 'No faces found in the database' });
            }
            
            // Convert stored images to face descriptors
            const labeledDescriptors = await Promise.all(
                allFaces.map(async (faceDoc) => {
                    const imgBuffer = Buffer.from(faceDoc.image.split(',')[1], 'base64');
                    const img = await canvas.loadImage(imgBuffer);
                    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
                    return new faceapi.LabeledFaceDescriptors(faceDoc._id.toString(), detections.map(det => det.descriptor));
                })
            );

            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

            const imgBuffer = Buffer.from(image.split(',')[1], 'base64');
            const img = await canvas.loadImage(imgBuffer);
            const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

            if (detections.length === 0) {
                return res.json({ verified: false, message: 'No face detected' });
            }

            const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
            if (bestMatch.label !== 'unknown') {
                res.json({ verified: true, message: 'Face verified' });
            } else {
                res.json({ verified: false, message: 'Face not recognized' });
            }
        } catch (error) {
            console.error(`Verification error: ${error}`);
            res.status(500).send('Verification error.');
        }
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Error loading models:', err);
});