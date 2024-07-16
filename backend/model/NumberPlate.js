const mongoose = require('mongoose');

const NumberPlateSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('NumberPlate', NumberPlateSchema);