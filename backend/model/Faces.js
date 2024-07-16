const mongoose = require('mongoose');

const FacesSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    descriptor: {
        type: [Number],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Faces', FacesSchema);
