const mongoose = require('mongoose');
const Comment = require('./comment.js');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    githubUrl: {
        type: String,
        default: null
    },
    deployedUrl: {
        type: String,
        default: null
    },
    emojis: {
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

module.exports = mongoose.model('project', projectSchema);
