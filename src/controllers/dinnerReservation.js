const express = require('express');
const DinnerReservation = require('../model/dinnerReservation');
const { User } = require('../model/user');
const mongoose = require('mongoose');

const controller = express.Router();

const createReservation = async (req, res) => {
    try {
        const { placeName } = req.body;
        if (!placeName) {
            res.status(400).send('Place name required!');
        }

        const userId = req.auth.id;
        const user = await User.findOne({ _id: userId });
        let reservation = await DinnerReservation.findOne({
            placeName: placeName
        });
        for (let i = 0; i < reservation.users.length; i++) {
            if (reservation.users[i]._id == userId) {
                return res
                    .status(409)
                    .json({ message: 'you have already registered' });
            }
        }
        const updated = await DinnerReservation.updateOne(
            { _id: reservation._id },
            { $push: { users: user } }
        );

        reservation = await DinnerReservation.findOne({ placeName: placeName });
        if (updated.modifiedCount > 0) {
            return res.status(200).json(reservation);
        } else {
            return res.status(400).json({ message: "didn't find you" });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const deleteReservation = async (req, res) => {
    try {
        let deleteId;
        const { placeName } = req.body;
        if (!placeName) {
            res.status(400).send('Place name required!');
        }

        const userId = req.auth.id;
        let reservation = await DinnerReservation.findOne({
            placeName: placeName
        });
        for (let i = 0; i < reservation.users.length; i++) {
            if (reservation.users[i]._id == userId) {
                deleteId = reservation.users[i]._id;
            }
        }

        const updated = await DinnerReservation.updateOne(
            {
                _id: mongoose.Types.ObjectId(reservation._id)
            },
            {
                $pull: {
                    users: {
                        _id: mongoose.Types.ObjectId(deleteId)
                    }
                }
            }
        );

        reservation = await DinnerReservation.findOne({ placeName: placeName });

        if (updated.modifiedCount > 0) {
            return res.status(200).json(reservation);
        } else {
            return res.status(400).json({ message: "didn't find you" });
        }
    } catch (err) {
        console.log(err);
    }
};

const getAllReservations = async (req, res) => {
    try {
        const reservations = await DinnerReservation.find({});
        return res.status(200).json(reservations);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const getReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await DinnerReservation.findOne({ _id: id });
        return res.status(200).json(reservation);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

controller.post('/', createReservation);
controller.post('/delete', deleteReservation);
controller.get('/', getAllReservations);
controller.get('/:id', getReservation);

module.exports = controller;
