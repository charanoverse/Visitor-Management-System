// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Resident'],
    default: 'Resident',
  },
  mobileNumber: {
    type: String,
  },
  flatNumber: {
    type: String,
  },
  vehicleNumber: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
