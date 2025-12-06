const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-thozhan.vercel.app"
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  })
);

app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/employers", require("./routes/employerRoutes"));
app.use("/api/auth/employee", require("./routes/authRoutes"));
app.use("/api/auth/employer", require("./routes/authRoutes_Employer"));
app.use("/api/employee", require("./routes/employeePassword"));
app.use("/api/employer", require("./routes/employerPassword"));
app.use("/api", require("./routes/jobs"));
app.use("/api/job-applications", require("./routes/jobApplications"));
app.use("/api/employeeProfile", require("./routes/employeeProfile"));
app.use("/api/employerProfile", require("./routes/employerProfile"));

// Test
app.get("/", (req, res) => {
  res.send("Backend running on Render!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
