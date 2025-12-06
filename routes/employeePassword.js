const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 1. Send Password Reset Link
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ error: "Email not registered" });
    }

    const token = jwt.sign({ id: employee._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password - TaskThozhan",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
    });

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ error: "Failed to send reset email", details: err.message });
  }
});

// 🔹 2. Handle Password Reset
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const employee = await Employee.findById(decoded.id);

    if (!employee) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.password = hashedPassword;
    await employee.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const bcrypt = require("bcryptjs");
// const Employee = require("../models/Employee");

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

// // Email setup (use Gmail App Password or SMTP provider in real use)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "arjunamar5@gmail.com",
//     pass: "rtad nhwf bqeq bjsl",
//   },
// });

// // 🔹 Route 1: Send Reset Link
// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;

//   try {
//     const employee = await Employee.findOne({ email });
//     if (!employee) {
//       return res.status(404).json({ error: "Email not registered" });
//     }

//     const token = jwt.sign({ id: employee._id }, JWT_SECRET, { expiresIn: "15m" });

//     const resetLink = `http://localhost:5173/reset-password/${token}`;

//     await transporter.sendMail({
//       from: "your_email@gmail.com",
//       to: email,
//       subject: "Reset Password - TaskThozhan",
//       html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
//     });

//     res.status(200).json({ message: "Reset link sent to email." });
//   } catch (err) {
//     console.error("❌ Forgot Password Error:", err);
//     res.status(500).json({ error: "Failed to send reset email." });
//   }
// });

// // 🔹 Route 2: Handle Password Reset
// router.post("/reset-password/:token", async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const employee = await Employee.findById(decoded.id);

//     if (!employee) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     employee.password = hashedPassword;
//     await employee.save();

//     res.status(200).json({ message: "Password updated successfully." });
//   } catch (err) {
//     console.error("❌ Reset Password Error:", err);
//     res.status(400).json({ error: "Invalid or expired token." });
//   }
// });

// module.exports = router;
