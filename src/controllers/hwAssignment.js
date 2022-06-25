const Assignment = require('../model/hwAssignment.js');
const express = require('express');
const isMentor = require('../middleware/isMentor.js');

const controller = express.Router();

const createAssignment = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!(title && description)) {
            res.status(400).send('Title and description are required!');
        }

        const mentorId = req.auth.id;

        const assignment = await Assignment.create({
            title,
            description,
            mentorId
        });

        return res.status(200).json(assignment);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await Assignment.deleteOne({ _id: id });
        return res
            .status(200)
            .json({ message: 'deleted assignment successfully!' });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({});
        return res.status(200).json(assignments);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const getAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findOne({ _id: id });
        return res.status(200).json(assignment);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

controller.post('/', isMentor, createAssignment);
controller.delete('/:id', isMentor, deleteAssignment);
controller.get('/', getAllAssignments);
controller.get('/:id', getAssignment);

module.exports = controller;
