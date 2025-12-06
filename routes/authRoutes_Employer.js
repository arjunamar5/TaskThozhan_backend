const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // ✅ Add bcrypt
const Employer = require("../models/Employer");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "blah_blah123";

// ✅ Employer Login Route (With bcrypt)
router.post("/login", async (req, res) => {
  console.log("📥 Employer Login Request Received");

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const employer = await Employer.findOne({ email });

    if (!employer) {
      console.log("❌ Employer not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: employer._id,
        userType: "employer",  // ✅ lowercase
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    

    console.log("✅ Employer Authenticated");
    res.status(200).json({
      message: "Login successful",
      userType: "Employer",
      token,
      employer: {
        id: employer._id,
        name: employer.name,
        email: employer.email,
      },
    });
  } catch (error) {
    console.error("❌ Employer Login Error:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

module.exports = router;
