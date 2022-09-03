const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["scheduled", "active", "invoicing", "to priced", "completed"],
            message: "{VALUE} is not supported",
        },
    },
    client: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: [
                function () {
                    return !this.client.mobile;
                },
                "Please enter an Email or Mobile Number",
            ],
            validate: [validator.isEmail, "Email is not valid"],
        },
        mobile: {
            type: String,
            required: [
                function () {
                    return !this.client.email;
                },
                "Please enter an Email or Mobile Number",
            ],
            validate: [validator.isMobilePhone, "Mobile number is not valid"],
        },
    },
    notes: {
        type: [String],
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Job", jobSchema);
