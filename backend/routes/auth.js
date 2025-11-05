const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

const validateBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: 'Request body is empty or missing',
        message: 'Please provide valid JSON data in the request body'
      });
    }
    next();
};




// regis only one admin user
router.post('/register-admin', async (req, res) => {
    try {        
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }

        const { username, email, password } = req.body;
        const newAdmin = new User({ username, email, password, role: 'admin' });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', validateBody, async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            console.log('Missing email or password in request body');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// router.post('/test', validateBody, (req, res) => {
//     const { username, email } = req.body;
//     res.json({
//       message: 'Test successful',
//       received: { username, email }
//     });
//   });
  
router.post('/test', auth, (req, res) => {
    console.log('🧪 Test endpoint - Authenticated user:', req.user.email);
    const { username, email } = req.body;
    res.json({
      message: 'Test successful - User authenticated',
      user: req.user.email,
      received: { username, email }
    });
});
module.exports = router;