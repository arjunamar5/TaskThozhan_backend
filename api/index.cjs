const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");

// ----------------------------
// Express App
// ----------------------------
const app = express();
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-thozhan.vercel.app",
    ],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// ----------------------------
// MongoDB Connection
// ----------------------------
const MONGO_URI = process.env.MONGO_URI;

if (!mongoose.connection.readyState) {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));
}

// ----------------------------
// Routes (your old require() is fine)
// ----------------------------
const employeeRoutes = require("../routes/employeeRoutes");
const employerRoutes = require("../routes/employerRoutes");
const authRoutes = require("../routes/authRoutes");
const authRoutes_Employer = require("../routes/authRoutes_Employer");
const employeePasswordRoutes = require("../routes/employeePassword");
const employerPasswordRoutes = require("../routes/employerPassword");
const jobRoutes = require("../routes/jobs");
const jobApplicationsRoutes = require("../routes/jobApplications");
const employeeProfileRoutes = require("../routes/employeeProfile");
const employerProfileRoutes = require("../routes/employerProfile");

// Attach routes
app.use("/api/employees", employeeRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/auth/employee", authRoutes);
app.use("/api/auth/employer", authRoutes_Employer);
app.use("/api/employee", employeePasswordRoutes);
app.use("/api/employer", employerPasswordRoutes);
app.use("/api", jobRoutes);
app.use("/api/job-applications", jobApplicationsRoutes);
app.use("/api/employeeProfile", employeeProfileRoutes);
app.use("/api/employerProfile", employerProfileRoutes);

// Test route
app.get("/api", (req, res) => {
  res.send("TaskThozhan Backend Running on Vercel with CommonJS!");
});

// ----------------------------
// Export serverless handler
// ----------------------------
module.exports = serverless(app);
