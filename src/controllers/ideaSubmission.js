const IdeaSubmission = require('../model/ideaSubmission.js');
const express = require('express');
const isMentor = require('../middleware/isMentor.js');

const controller = express.Router();

const createSubmission = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!(title && description)) {
            return res.status(400).send('Title and description are required!');
        }

        const studentId = req.auth.id;

        const assignment = await IdeaSubmission.create({
            title,
            description,
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
        const submissions = await IdeaSubmission.find({ studentId });
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
        const submission = await IdeaSubmission.findOne({ _id: id, studentId });
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
        const result = await IdeaSubmission.deleteOne({ _id: id, studentId });
        // Получается только сам студент может удалить свой сабмишн
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
        const updated = await IdeaSubmission.findOneAndUpdate(
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
                .json({ message: 'Вы не можете комментировать эту идею' });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const setSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const mentorId = req.auth.id;

        if (
            !(
                status === 'waiting_for_approval' ||
                status === 'received_comments' ||
                status === 'approved' ||
                status === 'rejected'
            )
        ) {
            return res.status(400).json({
                message:
                    'Статус должен быть одним из: waiting_for_approval | received_comments | approved | rejected'
            });
        }

        const updated = await IdeaSubmission.findOneAndUpdate(
            { _id: id },
            { status, mentorId },
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
controller.post('/:id/status', isMentor, setSubmissionStatus);

module.exports = controller;
