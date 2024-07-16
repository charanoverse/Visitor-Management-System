const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  flatNumber: String,
  mobileNumber: String,
  vehicles: [String],
  familyMembers: [{ name: String }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
