const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// ✅ GET all active jobs with company name
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).populate("companyId", "name");
    res.json({ success: true, jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
});

// ✅ POST new job
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ success: true, message: 'Job posted successfully', job });
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).json({ success: false, message: 'Failed to post job' });
  }
});

module.exports = router;
