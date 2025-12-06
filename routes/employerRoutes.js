const express = require("express");
const bcrypt = require("bcryptjs");
const Employer = require("../models/Employer");

const router = express.Router();

console.log("✅ employerRoutes.js Loaded!");

// ✅ Employer Registration Route
router.post("/register", async (req, res) => {
  console.log("📥 Received Employer Register Request");

  const { name, email, phone, password, companyName, country, state, city } = req.body;

  if (!name || !email || !phone || !password || !companyName || !country || !state || !city) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = new Employer({
      name,
      email,
      phone,
      password: hashedPassword,
      companyName,
      country,
      state,
      city
    });

    await newEmployer.save();
    console.log("✅ Employer Registered");

    res.status(201).json({ message: "Employer registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Error registering employer" });
  }
});

module.exports = router;

// const express = require("express");
// const Employer = require("../models/Employer");

// const router = express.Router();

// console.log("✅ employerRoutes.js Loaded!");

// // Employer Registration Route
// router.post("/register", async (req, res) => {
//   console.log("📥 Received Employer Register Request");

//   const { name, email, phone, password, companyName, companyLocation } = req.body;

//   if (!name || !email || !phone || !password || !companyName || !companyLocation) {
//     console.log("❌ Missing Fields");
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const existingEmployer = await Employer.findOne({ email });
//     if (existingEmployer) {
//       console.log("⚠️ Email already exists");
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     const newEmployer = new Employer({ name, email, phone, password, companyName, companyLocation });
//     await newEmployer.save();

//     console.log("✅ Employer Registered");
//     res.status(201).json({ message: "Employer registered successfully" });
//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     res.status(500).json({ error: "Error registering employer" });
//   }
// });

// module.exports = router;
