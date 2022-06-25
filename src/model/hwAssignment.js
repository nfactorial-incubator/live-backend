const mongoose = require('mongoose');

const hwAssignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('hwAssignment', hwAssignmentSchema);
