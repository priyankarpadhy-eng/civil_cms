const bcrypt = require('bcrypt');
const Alumni = require('../models/alumniSchema.js');

const alumniRegister = async (req, res) => {
    try {
        const { name, email, password, registrationNum, passoutYear, school } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const alumni = new Alumni({
            name,
            email,
            password: hashedPass,
            registrationNum,
            passoutYear,
            school
        });

        const existingAlumniByEmail = await Alumni.findOne({ email });
        const existingAlumniByReg = await Alumni.findOne({ registrationNum });

        if (existingAlumniByEmail) {
            res.send({ message: 'Email already exists' });
        } else if (existingAlumniByReg) {
            res.send({ message: 'Registration number already exists' });
        } else {
            let result = await alumni.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const alumniLogIn = async (req, res) => {
    try {
        let alumni = await Alumni.findOne({ email: req.body.email });
        if (alumni) {
            const validated = await bcrypt.compare(req.body.password, alumni.password);
            if (validated) {
                if (!alumni.isApproved) {
                    return res.send({ message: "Your account is pending approval from Admin." });
                }
                alumni.password = undefined;
                res.send(alumni);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Alumni not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAlumniList = async (req, res) => {
    try {
        let alumni = await Alumni.find({ school: req.params.id });
        res.send(alumni);
    } catch (err) {
        res.status(500).json(err);
    }
};

const approveAlumni = async (req, res) => {
    try {
        const result = await Alumni.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const rejectAlumni = async (req, res) => {
    try {
        const result = await Alumni.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateAlumni = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        let result = await Alumni.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        result.password = undefined;
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    alumniRegister,
    alumniLogIn,
    getAlumniList,
    approveAlumni,
    rejectAlumni,
    updateAlumni
};
