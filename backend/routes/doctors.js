// routes/doctors.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { verifyDoctor } = require('../controllers/doctorController');
const { protectDoctor } = require('../controllers/doctorController');
const auth = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();  
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/doctor.js or similar
router.post('/verify', verifyDoctor);


router.get('/me', protectDoctor, (req, res) => {
  res.json({ doctor: req.doctor });
});

module.exports = router;
