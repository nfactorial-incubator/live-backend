const mongoose = require('mongoose');
const Comment = require('./comment.js');

const hwSubmissionSchema = new mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    comments: {
        type: [Comment],
        default: []
    },
    grade: {
        type: String,
        default: 'plastic',
        enum: ['plastic', 'bronze', 'silver', 'gold', 'platinum']
    }
});

module.exports = mongoose.model('hwSubmission', hwSubmissionSchema);
