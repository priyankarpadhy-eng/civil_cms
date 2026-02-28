const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Alumni = require('../models/alumniSchema.js');

const getPublicFaculty = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .select('name designation specialization profilePic education experience subjectExpertise projects isHOD hodMessage')
            .sort({ isHOD: -1, designation: 1 });
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getPublicReps = async (req, res) => {
    try {
        const students = await Student.find({ $or: [{ isBranchRep: true }, { isCDC: true }] })
            .populate('sclassName', 'sclassName passoutYear batchNumber')
            .select('name rollNum isBranchRep isCDC sclassName profilePic');

        // Sorting by batch passoutYear (oldest first)
        const sortedStudents = students.sort((a, b) => {
            const yearA = a.sclassName?.passoutYear || 0;
            const yearB = b.sclassName?.passoutYear || 0;
            if (yearA !== yearB) return yearA - yearB;
            return (a.sclassName?.batchNumber || 0) - (b.sclassName?.batchNumber || 0);
        });

        res.status(200).json(sortedStudents);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAlumni = async (req, res) => {
    try {
        const alumni = await Alumni.find({ isApproved: true })
            .select('name biography company jobTitle profilePic passoutYear');
        res.status(200).json(alumni);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getPublicFaculty,
    getPublicReps,
    getAlumni
};
