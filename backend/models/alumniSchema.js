const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registrationNum: {
        type: String,
        unique: true,
        required: true
    },
    passoutYear: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: "Alumni"
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
    },
    biography: {
        type: String,
    },
    company: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    }
}, { timestamps: true });

module.exports = mongoose.model("alumni", alumniSchema);
