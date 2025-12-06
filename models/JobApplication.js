const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  fullName: String,
  email: String,
  phone: String,
  coverLetter: String,
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'selected', 'rejected'],
    default: 'pending', // ✅ Default is pending
  }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
  