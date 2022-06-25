const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String },
    registeredUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    startDate: { type: Date, required: true }
});

const toEventDTO = (model) => {
    return {
        id: model.id,
        title: model.title,
        description: model.description ?? '',
        registeredUsersCount: model.registeredUsers.length,
        startDate: model.startDate
    };
};

module.exports = { Event: mongoose.model('event', eventSchema), toEventDTO };
