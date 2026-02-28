const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNum: {
        type: Number,
        required: true
    },
    registrationNum: {
        type: String,
        unique: true
    },
    currentSemester: {
        type: Number,
        default: 1
    },
    password: {
        type: String,
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
    isBranchRep: {
        type: Boolean,
        default: false
    },
    section: {
        type: String,
        default: 'A'
    },
    isCDC: {
        type: Boolean,
        default: false
    },
    isAlumni: {
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
    faceData: {
        type: String, // String to store base64 image or descriptor
    },
    faceCaptured: {
        type: Boolean,
        default: false
    },
    faceDescriptor: {
        type: [Number], // Store 128-float face descriptor
    },
    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
            },
            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        },
        subName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        }
    }],
    portfolioSlug: {
        type: String,
        unique: true,
        sparse: true // Allows null/empty for existing records until updated
    },
    portfolioTheme: {
        type: String,
        default: 'modern'
    }
});

module.exports = mongoose.model("student", studentSchema);