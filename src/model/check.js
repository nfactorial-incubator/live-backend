const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['in', 'out'],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = checkSchema;
