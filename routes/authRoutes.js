const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import JWT
const Employee = require("../models/Employee");

const router = express.Router();

console.log("✅ employeeAuth.js Loaded!");

// ✅ Employee Login Route
router.post("/login", async (req, res) => {
  console.log("📥 Received Employee Login Request");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      console.log("❌ Employee not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ Employee Authenticated");

    // Generate JWT token after successful authentication
    // const token = jwt.sign(
    //   { id: employee._id }, // Payload (Employee ID)
    //   process.env.JWT_SECRET, // Secret key (use a secure key)
    //   { expiresIn: "7d" } // Token expiration time (1 hour)
    // );
    const token = jwt.sign(
  { user: { id: employee._id } }, // ✅ Correct structure
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    res.status(200).json({
      message: "Login successful",
      token, // Send the token in the response
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        country: employee.country,
        state: employee.state,
        city: employee.city
      },
    });
  } catch (error) {
    console.error("❌ Employee Login Error:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

module.exports = router;
