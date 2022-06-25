const mongoose = require('mongoose');
const Comment = require('./comment.js');

const ideaSubmissionSchema = new mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
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
    status: {
        type: String,
        default: 'waiting_for_approval',
        enum: [
            'waiting_for_approval',
            'received_comments',
            'approved',
            'rejected'
        ]
    }
});

module.exports = mongoose.model('ideaSubmission', ideaSubmissionSchema);
