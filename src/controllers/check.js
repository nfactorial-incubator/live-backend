const { User, toUserDTO } = require('../model/user.js');
const express = require('express');

const controller = express.Router();

const checkIn = async (req, res) => {
    try {
        const id = req.auth.id;
        const check = { type: 'in' };
        const user = await User.findById(id);
        const lastCheck = user.checks.pop();

        if (lastCheck && lastCheck.type === 'in') {
            return res.status(400).json({
                message: "Consecutive checks can't be equal! "
            });
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { $push: { checks: check } },
            { new: true }
        );

        return res.status(200).json(updated.checks.pop());
        // return res.status(200).json({
        //     message: `Check In Successful at ${updated.checks.pop().createdAt}`
        // });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const checkOut = async (req, res) => {
    try {
        const id = req.auth.id;
        const check = { type: 'out' };
        const user = await User.findById(id);
        const lastCheck = user.checks.pop();

        if (lastCheck && lastCheck.type === 'out') {
            return res.status(400).json({
                message: "Consecutive checks can't be equal!"
            });
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { $push: { checks: check } },
            { new: true }
        );

        return res.status(200).json(updated.checks.pop());
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const getLastCheck = async (req, res) => {
    try {
        const id = req.auth.id;
        const user = await User.findById(id);
        const lastCheck = user.checks.pop();
        return res.status(200).json({ lastCheck });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const getAllChecks = async (req, res) => {
    try {
        const userId = req.params.userId ?? req.auth.id;
        const user = await User.findById(userId);
        const checks = user.checks;
        return res.status(200).json({ checks });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

controller.post('/in', checkIn);
controller.post('/out', checkOut);
controller.get('/last', getLastCheck);
controller.get('/', getAllChecks);
controller.get('/:userId', getAllChecks);

module.exports = controller;
