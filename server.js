require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/user");

// Express app
const app = express();

// Middleware to parse json data
app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);

// Connect to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requrests
        app.listen(process.env.PORT, () => {
            console.log("Connected to database & listening on port", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });
