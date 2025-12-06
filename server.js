const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix CORS (should be before any route is used)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend (React development server)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// ✅ JSON Body Parser
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Import Routes (after app is defined)
const employeeRoutes = require("./routes/employeeRoutes");
const employerRoutes = require("./routes/employerRoutes");
const authRoutes = require("./routes/authRoutes");
const authRoutes_Employer = require("./routes/authRoutes_Employer");
const employeePasswordRoutes = require("./routes/employeePassword");
const employerPasswordRoutes = require("./routes/employerPassword");
const jobRoutes = require("./routes/jobs"); // ✅ Job Posting Routes
const jobApplicationsRoutes = require("./routes/jobApplications");
const employeeProfileRoutes = require('./routes/employeeProfile'); // ✅ Employee Profile Routes
const employerProfileRoutes = require('./routes/employerProfile'); // ✅ Employer Profile Routes

// ✅ Attach Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/auth/employee", authRoutes);
app.use("/api/auth/employer", authRoutes_Employer);
app.use("/api/employee", employeePasswordRoutes);
app.use("/api/employer", employerPasswordRoutes);
app.use("/api", jobRoutes); // ✅ Enables /api/jobs & /api/employer/jobs
app.use("/api/job-applications", jobApplicationsRoutes);

// ✅ Attach Profile Routes
app.use('/api/employerProfile', employerProfileRoutes); // ✅ Employer Profile Route
app.use('/api/employeeProfile', employeeProfileRoutes); // ✅ Employee Profile Route

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("TaskThozhan Backend is Running with MongoDB & Express!");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
