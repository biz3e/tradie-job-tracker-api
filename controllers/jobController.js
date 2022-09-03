const Job = require("../models/jobModel");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

// Get all jobs
const getJobs = async (req, res) => {
    let filter = {};
    let sort = {};

    if (req.query.name) {
        filter = { ...filter, "client.name": req.query.name.split("|") };
    }
    if (req.query.email) {
        filter = { ...filter, "client.email": req.query.email.split("|") };
    }
    if (req.query.mobile) {
        filter = { ...filter, "client.mobile": req.query.mobile.split("|") };
    }
    if (req.query.status) {
        filter = { ...filter, status: req.query.status.split("|") };
    }

    // Checks if date filter is for range or for specific date
    if (Array.isArray(req.query.date)) {
        // Setting date in New Zealand time
        req.query.date.forEach((c) => {
            const split = c.split(":");
            // gte stands for Greater than or equal to
            if (split[0] === "gte") {
                const start = DateTime.fromFormat(split[1], "yyyy-MM-dd", { locale: "en-NZ" }).startOf("day");
                if (start.isValid) {
                    filter = {
                        ...filter,
                        date: {
                            $gte: start.toJSDate(),
                        },
                    };
                }
                // lte stands for Less than or equal to
            } else if (split[0] === "lte") {
                const end = DateTime.fromFormat(split[1], "yyyy-MM-dd", { locale: "en-NZ" }).endOf("day");
                if (end.isValid) {
                    filter = {
                        ...filter,
                        date: {
                            ...filter.date,
                            $lte: end.toJSDate(),
                        },
                    };
                }
            }
        });
    } else if (req.query.date) {
        const split = req.query.date.split(":");

        if (split[0] === "gte") {
            const start = DateTime.fromFormat(split[1], "yyyy-MM-dd", { locale: "en-NZ" }).startOf("day");

            if (start.isValid) {
                filter = {
                    ...filter,
                    date: {
                        $gte: start.toJSDate(),
                    },
                };
            }
        } else if (split[0] === "lte") {
            const end = DateTime.fromFormat(split[1], "yyyy-MM-dd", { locale: "en-NZ" }).endOf("day");

            if (end.isValid) {
                filter = {
                    ...filter,
                    date: {
                        $lte: end.toJSDate(),
                    },
                };
            }
        } else if (split[0] === "eq") {
            const start = DateTime.fromFormat(split[1], "yyyy-MM-dd", { locale: "en-NZ" }).startOf("day");
            const end = DateTime.fromFormat(split[1], "yyyy-MM-dd", { locale: "en-NZ" }).endOf("day");

            if (start.isValid && end.isValid) {
                filter = {
                    ...filter,
                    date: {
                        $gte: start.toJSDate(),
                        $lte: end.toJSDate(),
                    },
                };
            }
        }
    }

    if (req.query.sort_by && req.query.order_by) {
        if (req.query.sort_by === "name" && (req.query.order_by === "asc" || req.query.order_by === "desc")) {
            sort = { "client.name": req.query.order_by };
        } else if (req.query.sort_by === "email" && (req.query.order_by === "asc" || req.query.order_by === "desc")) {
            sort = { "client.email": req.query.order_by };
        } else if (req.query.sort_by === "mobile" && (req.query.order_by === "asc" || req.query.order_by === "desc")) {
            sort = { "client.mobile": req.query.order_by };
        } else if (req.query.order_by === "asc" || req.query.order_by === "desc") {
            sort = { [req.query.sort_by]: req.query.order_by };
        }
    }

    const jobs = await Job.find({ ...filter, user_id: req.user._id })
        .collation({ locale: "en", strength: 2 })
        .sort(sort);

    res.status(200).json(jobs);
};

// Get a single job
const getJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such job" });
    }

    const job = await Job.findOne({ _id: id, user_id: req.user._id });

    if (!job) {
        return res.status(404).json({ error: "No such job" });
    } else {
        res.status(200).json(job);
    }
};

// Create a new job
const createJob = async (req, res) => {
    const { status, client, notes } = req.body;

    try {
        const job = await Job.create({ status, client, notes, user_id: req.user._id });
        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a job
const deleteJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such job" });
    }

    const job = await Job.findOneAndDelete({ _id: id, user_id: req.user._id });

    if (!job) {
        return res.status(404).json({ error: "No such job" });
    } else {
        res.status(200).json(job);
    }
};

// Update a job
const updateJob = async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such job" });
    }

    try {
        const job = await Job.findOneAndUpdate({ _id: id, user_id: req.user._id }, { status, notes }, { new: true });
        if (!job) {
            return res.status(404).json({ error: "No such job" });
        } else {
            res.status(200).json(job);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob,
};
