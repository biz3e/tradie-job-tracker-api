const express = require("express");
const { createJob, getJob, getJobs, deleteJob, updateJob } = require("../controllers/jobController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

// GET all jobs
router.get("/", getJobs);

// GET a single job
router.get("/:id", getJob);

// POST a new job
router.post("/", createJob);

// DELETE a job
router.delete("/:id", deleteJob);

// UPDATE a job
router.patch("/:id", updateJob);

module.exports = router;
