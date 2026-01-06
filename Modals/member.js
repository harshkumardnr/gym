const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
    },
    address: {
        type: String
    },
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'membership',
        required: true
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gym',
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Active"
    },
    batch: {
        type: String,
        enum: ["Morning", "Evening"],
        required: true
    }, 
    occupation: String,
    fatherName: String,
    bodyWeight: Number,
    goal: {
        type: String,
        enum: ["Cutting", "Bulking", "Fatloss"]
    },
    lastPayment: {
        type: Date,
        default: new Date()
    },
    nextBillDate: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const memberModal = mongoose.model("member", memberSchema);

module.exports = memberModal;