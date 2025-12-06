const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const verifyEmployer = require("../middleware/verifyEmployer");

// Get all jobs (for employees) including company name
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate({
        path: 'createdBy', // Populating employer's data
        select: 'companyName' // Select only the company name from the employer
      })
      .sort({ createdAt: -1 }); // Sort jobs by latest first
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
    res.status(500).json({ message: "Failed to load job listings" });
  }
});

// Get a specific job by ID
router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'createdBy',
        select: 'companyName'
      });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all jobs posted by the logged-in employer
router.get("/employer/jobs", verifyEmployer, async (req, res) => {
  try {
    const employerId = req.user.id;
    const jobs = await Job.find({ createdBy: employerId })
      .populate({
        path: 'createdBy',
        select: 'companyName'
      })
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Job fetch error:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// Create a new job post (for employer)
router.post("/jobs", verifyEmployer, async (req, res) => {
  try {
    const { title, description, location, salary, jobType } = req.body;
    const employerId = req.user.id;

    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      createdBy: employerId, // Link to employer
      status: "Open",
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error("Job creation error:", err);
    res.status(500).json({ message: "Server error while creating job" });
  }
});

// Apply for a job
router.post("/jobs/:id/apply", async (req, res) => {
  const jobId = req.params.id;
  const { fullName, email, phone, coverLetter } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = {
      fullName,
      email,
      phone,
      coverLetter,
      appliedAt: new Date()
    };

    job.applications.push(application);
    await job.save();

    res.status(200).json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Server error while submitting application" });
  }
});

// Delete a specific job by ID (for employer)
router.delete("/jobs/:id", verifyEmployer, async (req, res) => {
  try {
    const employerId = req.user.id;
    const jobId = req.params.id;

    const deletedJob = await Job.findOneAndDelete({ _id: jobId, createdBy: employerId });
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json({ message: "Job deleted successfully", id: jobId });
  } catch (err) {
    console.error("Job deletion error:", err);
    res.status(500).json({ message: "Server error while deleting job" });
  }
});

// Update a specific job by ID (for employer)
router.put("/jobs/:id", verifyEmployer, async (req, res) => {
  const jobId = req.params.id;
  const employerId = req.user.id;

  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, createdBy: employerId },
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json(updatedJob);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating job" });
  }
});

module.exports = router;
