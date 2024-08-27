const express = require('express');
const auth = require('../middleware/auth');
const User = require('../model/User');
const router = express.Router();

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  const { mobileNumber, flatNumber, vehicleNumber } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.flatNumber = flatNumber || user.flatNumber;
    user.vehicleNumber = vehicleNumber || user.vehicleNumber;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
