const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const Employee = require("../models/Employee");


// ✅ Employee Registration Route
router.post("/register", async (req, res) => {
  console.log("📥 Received Employee Register Request");

  const { name, email, phone, password, country, state, city } = req.body;

  if (!name || !email || !phone || !password || !country || !state || !city) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      phone,
      password: hashedPassword,
      country,
      state,
      city,
    });

    await newEmployee.save();
    console.log("✅ Employee Registered");

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Error registering employee" });
  }
});

module.exports = router;

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const Employee = require("../models/Employee");

// const router = express.Router();

// console.log("✅ employeeRoutes.js Loaded!");

// // ✅ Employee Registration Route
// router.post("/register", async (req, res) => {
//   console.log("📥 Received Employee Register Request");

//   const { name, email, phone, password, country, state, city } = req.body;

//   if (!name || !email || !phone || !password || !country || !state || !city) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const existingEmployee = await Employee.findOne({ email });
//     if (existingEmployee) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newEmployee = new Employee({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       country,
//       state,
//       city,
//     });

//     await newEmployee.save();
//     console.log("✅ Employee Registered");

//     res.status(201).json({ message: "Employee registered successfully" });
//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     res.status(500).json({ error: "Error registering employee" });
//   }
// });

// module.exports = router;
