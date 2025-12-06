const express = require('express');
const router = express.Router();
const Employer = require('../models/Employer');
const authMiddleware = require('../middleware/verifyEmployer');

// GET profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id).select('-password');
    res.json(employer);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// PUT profile update
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updated = await Employer.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
