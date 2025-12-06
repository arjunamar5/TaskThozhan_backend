const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');

// ✅ Employee-side: Get all applications submitted by the employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const applications = await JobApplication.find({ employeeId: req.params.employeeId })
      .populate({
        path: 'jobId',
        populate: {
          path: 'createdBy',
          model: 'Employer' // Ensure your Employer model name matches this string
        }
      });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// ✅ Employer-side: Get all applications received for employer's jobs
router.get('/employer/:employerId', async (req, res) => {
  try {
    const { employerId } = req.params;
    const applications = await JobApplication.find({ employerId })
    .populate('jobId');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// ✅ Update the status (select/reject) of a job application
router.put('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const updated = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ✅ Create a new job application
router.post("/", async (req, res) => {
  try {
    const { jobId, employeeId, fullName, email, phone, coverLetter } = req.body;

    console.log("📩 Incoming data:", req.body);

    if (!jobId || !employeeId || !fullName || !email || !phone || !coverLetter) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.createdBy) {
      return res.status(500).json({ message: "Job has no createdBy (employerId) set." });
    }

    const newApplication = new JobApplication({
      jobId,
      employerId: job.createdBy,
      employeeId,
      fullName,
      email,
      phone,
      coverLetter,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully" });

  } catch (err) {
    console.error("🔥 Error in /api/job-applications:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
