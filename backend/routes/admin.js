// routes/admin.js
const express = require('express');
const User = require('../model/User');

const router = express.Router();

// Get all residents
router.get('/residents', async (req, res) => {
  try {
    const residents = await User.find({ role: 'Resident' });
    res.json(residents);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
