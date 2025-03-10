const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitorSchema = new Schema({
  residentEmail: {
    type: String,
    required: true,
  },
  residentName: {
    type: String,
    required: true,
  },
  visitorName: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
});

// Check if the model already exists before defining it
const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
