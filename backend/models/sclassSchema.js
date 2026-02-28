const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema({
    sclassName: { // This will represent Batch Name
        type: String,
        required: true,
    },
    passoutYear: {
        type: String,
        required: true,
    },
    batchNumber: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    sections: {
        type: [String],
        default: ['A', 'B']
    },
}, { timestamps: true });

module.exports = mongoose.model("sclass", sclassSchema);

