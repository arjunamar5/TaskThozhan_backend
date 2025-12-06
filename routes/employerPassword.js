const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Employer = require("../models/Employer");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

// ✅ Gmail App Password transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // e.g., arjunamar5@gmail.com
    pass: process.env.EMAIL_PASS,       // e.g., App Password
  },
});

// 🔹 Route 1: Send Reset Link to Employer
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(404).json({ error: "Email not registered" });
    }

    const token = jwt.sign({ id: employer._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:5173/employer/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password - TaskThozhan Employer",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
    });

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("❌ Employer Forgot Password Error:", err);
    res.status(500).json({ error: "Failed to send reset email", details: err.message });
  }
});

// 🔹 Route 2: Reset Employer Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const employer = await Employer.findById(decoded.id);

    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employer.password = hashedPassword;
    await employer.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (err) {
    console.error("❌ Employer Reset Password Error:", err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
