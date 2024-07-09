const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const extractNumberPlate = require('./extractNumberPlate');
const NumberPlate = require('./models/NumberPlate'); 

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

mongoose.connect('mongodb+srv://sricharankolachalama:******@cluster101.qwrvkrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster101', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/extractNumberPlate', extractNumberPlate);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
