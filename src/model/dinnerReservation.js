const mongoose = require('mongoose');
const { UserSchema } = require('../model/user.js');

const dinnerReservationSchema = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    info: {
        type: Map,
        of: new mongoose.Schema({
            address: {
                type: String,
                default: null
            },
            link: {
                type: String,
                default: null
            }
        })
    },
    users: {
        type: [UserSchema],
        default: []
    }
});

module.exports = mongoose.model('dinnerReservation', dinnerReservationSchema);
