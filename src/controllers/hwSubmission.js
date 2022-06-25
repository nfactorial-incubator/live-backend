const HwSubmission = require('../model/hwSubmission.js');
const express = require('express');
const isMentor = require('../middleware/isMentor.js');

const controller = express.Router();

const createSubmission = async (req, res) => {
    try {
        const { title, description, assignmentId } = req.body;

        if (!(title && description)) {
            return res.status(400).send('Title and description are required!');
        }

        if (!assignmentId) {
            return res.status(400).send('Assignment Id is required!');
        }

        const studentId = req.auth.id;

        const assignment = await HwSubmission.create({
            title,
            description,
            assignmentId,
            studentId
        });

        return res.status(200).json(assignment);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const getAllSubmissions = async (req, res) => {
    try {
        const studentId = req.auth.id;
        const submissions = await HwSubmission.find({ studentId });
        return res.status(200).json(submissions);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const getSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.auth.id;
        const submission = await HwSubmission.findOne({ _id: id, studentId });
        return res.status(200).json(submission);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.auth.id;
        await HwSubmission.deleteOne({ _id: id, studentId });
        return res
            .status(200)
            .json({ message: 'deleted submission successfully!' });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const commentSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.auth.id;
        const comment = { text };
        const updated = await HwSubmission.findOneAndUpdate(
            {
                $and: [
                    { _id: id },
                    { $or: [{ studentId: userId }, { mentorId: userId }] }
                ]
            },
            { $push: { comments: comment } },
            { new: true }
        );
        if (updated) {
            return res.status(200).json(updated);
        } else {
            return res
                .status(400)
                .json({ message: 'Вы не можете комментировать эту домашку' });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const gradeSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { grade } = req.body;
        const mentorId = req.auth.id;

        if (
            !(
                grade === 'plastic' ||
                grade === 'bronze' ||
                grade === 'silver' ||
                grade === 'gold' ||
                grade === 'premium'
            )
        ) {
            return res.status(400).json({
                message:
                    'Оценка должна быть одной из plastic | bronze | silver | gold | premium'
            });
        }

        const updated = await HwSubmission.findOneAndUpdate(
            { _id: id },
            { grade, mentorId },
            { new: true }
        );

        return res.status(200).json(updated);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

controller.post('/', createSubmission);
controller.delete('/:id', deleteSubmission);
controller.get('/', getAllSubmissions);
controller.get('/:id', getSubmission);
controller.post('/:id/comment', commentSubmission);
controller.post('/:id/grade', isMentor, gradeSubmission);

module.exports = controller;
