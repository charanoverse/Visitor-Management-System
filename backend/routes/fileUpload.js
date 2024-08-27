const express = require('express');
const multer = require('multer');
const router = express.Router();
const Image = require('../model/Image');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const existingImage = await Image.findOne({ data: req.file.buffer });
        if (existingImage) {
            return res.status(400).json({ message: 'Image already exists' });
        }

        const newImage = new Image({
            data: req.file.buffer,
            contentType: req.file.mimetype,
        });
        await newImage.save();
        res.status(201).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

router.post('/scan', upload.single('file'), async (req, res) => {
    try {
        const image = await Image.findOne({ data: req.file.buffer });
        if (image) {
            res.status(200).json({ message: 'Number plate verified' });
        } else {
            res.status(404).json({ message: 'Not verified' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to scan image' });
    }
});

module.exports = router;
