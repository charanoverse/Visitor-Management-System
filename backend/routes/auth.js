const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// // Get Current User Route
// router.get('/user', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// Register Route
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body; // Include role in the request body
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ name, email, password, role }); // Include role in the new user object
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role, // Include role in the token payload
      }
    };
    jwt.sign(payload, 'yourSecretKey', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        } 
      });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
