const mongoose = require('mongoose');

const verifiedLogSchema = new mongoose.Schema({
  visitorName: String,
  purpose: String,
  relation: String,
  date: String,
  time: String,
  residentEmail: String,
  residentName: String,
  checkInTime: String,
  checkOutTime: String,
  expired: {
    type: Boolean,
    default: false
  }
});

const VerifiedLog = mongoose.model('VerifiedLog', verifiedLogSchema);

module.exports = VerifiedLog;
