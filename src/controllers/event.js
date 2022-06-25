const { Event, toEventDTO } = require('../model/event.js');
const express = require('express');

const controller = express.Router();

const getAll = async (req, res) => {
    try {
        const events = await Event.find();
        const dtos = events.map((e) => toEventDTO(e));
        return res.status(200).json(dtos);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const get = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.auth.id;
        const event = await Event.findOne({ id: eventId });
        const isRegistered = event.registeredUsers.includes(userId);
        return res.status(200).json({ ...toEventDTO(event), isRegistered });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const create = async (req, res) => {
    try {
        const { id, title, description, startDate } = req.body;
        const date = new Date(startDate * 1000); // converting from unix timestamp
        const event = await Event.create({
            id,
            title,
            description,
            startDate: date
        });
        return res.status(200).json(toEventDTO(event));
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const register = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.auth.id;

        const updated = await Event.findOneAndUpdate(
            { id: eventId },
            { $addToSet: { registeredUsers: userId } },
            { new: true }
        );
        const isRegistered = updated.registeredUsers.includes(userId);
        return res.status(200).json({ ...toEventDTO(updated), isRegistered });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const unregister = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.auth.id;

        const updated = await Event.findOneAndUpdate(
            { id: eventId },
            { $pull: { registeredUsers: userId } },
            { new: true }
        );
        const isRegistered = updated.registeredUsers.includes(userId);
        return res.status(200).json({ ...toEventDTO(updated), isRegistered });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};
controller.get('/:eventId', get);
controller.get('/', getAll);
controller.post('/', create);
controller.post('/:eventId/register', register);
controller.delete('/:eventId/register', unregister);

module.exports = controller;
