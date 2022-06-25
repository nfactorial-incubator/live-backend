const mongoose = require('mongoose');
const Check = require('./check.js');

const userSchema = new mongoose.Schema({
    firstname: { type: String, default: null, required: true },
    lastname: { type: String, required: true },
    nickname: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: 'student',
        enum: ['student', 'mentor']
    },
    avatar: { type: Buffer, default: null },
    token: { type: String },
    raspberries: { type: Number, default: 0 },
    checks: {
        type: [Check],
        default: []
    }
});

const toUserDTO = (model) => {
    return {
        firstname: model.firstname,
        lastname: model.lastname,
        nickname: model.nickname,
        role: model.role,
        token: model.token
    };
};

module.exports = {
    User: mongoose.model('user', userSchema),
    toUserDTO,
    UserSchema: userSchema
};
