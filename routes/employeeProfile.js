const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const verifyEmployee = require('../middleware/verifyEmployee');

// ✅ GET employee profile
router.get('/', verifyEmployee, async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password');
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ✅ PUT employee profile update
router.put('/', verifyEmployee, async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
