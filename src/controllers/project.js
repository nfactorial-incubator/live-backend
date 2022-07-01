const Project = require('../model/project.js');
const express = require('express');
const isMentor = require('../middleware/isMentor.js');
const { User } = require('../model/user.js');

const controller = express.Router();

// const getSubmission = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const studentId = req.auth.id;
//         const submission = await IdeaSubmission.findOne({ _id: id, studentId });
//         return res.status(200).json(submission);
//     } catch (err) {
//         console.log(err);
//         return res.status(502).json({ message: 'some shit on our side' });
//     }
// };

// const deleteSubmission = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const studentId = req.auth.id;
//         const result = await IdeaSubmission.deleteOne({ _id: id, studentId });
//         // Получается только сам студент может удалить свой сабмишн
//         return res
//             .status(200)
//             .json({ message: 'deleted submission successfully!' });
//     } catch (err) {
//         console.log(err);
//         return res.status(502).json({ message: 'some shit on our side' });
//     }
// };
// const commentSubmission = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { text } = req.body;
//         const userId = req.auth.id;
//         const comment = { text };
//         const updated = await IdeaSubmission.findOneAndUpdate(
//             {
//                 $and: [
//                     { _id: id },
//                     { $or: [{ studentId: userId }, { mentorId: userId }] }
//                 ]
//             },
//             { $push: { comments: comment } },
//             { new: true }
//         );
//         if (updated) {
//             return res.status(200).json(updated);
//         } else {
//             return res
//                 .status(400)
//                 .json({ message: 'Вы не можете комментировать эту идею' });
//         }
//     } catch (err) {
//         console.log(err);
//         return res.status(502).json({ message: 'some shit on our side' });
//     }
// };

// const setSubmissionStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;
//         const mentorId = req.auth.id;

//         if (
//             !(
//                 status === 'waiting_for_approval' ||
//                 status === 'received_comments' ||
//                 status === 'approved' ||
//                 status === 'rejected'
//             )
//         ) {
//             return res.status(400).json({
//                 message:
//                     'Статус должен быть одним из: waiting_for_approval | received_comments | approved | rejected'
//             });
//         }

//         const updated = await IdeaSubmission.findOneAndUpdate(
//             { _id: id },
//             { status, mentorId },
//             { new: true }
//         );

//         return res.status(200).json(updated);
//     } catch (err) {
//         console.log(err);
//         return res.status(502).json({ message: 'some shit on our side' });
//     }
// };

const createProject = async (req, res) => {
    try {
        const { title, description, githubUrl, deployedUrl, emojis } = req.body;

        if (
            !(
                title &&
                description &&
                githubUrl &&
                deployedUrl &&
                emojis &&
                emojis.length !== 2
            )
        ) {
            return res
                .status(400)
                .send({ message: 'All fields are required!' });
        }

        const studentId = req.auth.id;
        const user = await User.findById(studentId);

        const project = await Project.create({
            title,
            description,
            studentId,
            githubUrl,
            deployedUrl,
            emojis,
            nickname: user.nickname,
            fullname: user.firstname + ' ' + user.lastname
        });
        return res.status(200).json(project);
    } catch (err) {
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        return res.status(200).json(projects);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const updateProject = async (req, res) => {
    try {
        const { title, description, githubUrl, deployedUrl, emojis } = req.body;
        const { projectId } = req.params;

        const newProject = {
            ...(title && { title }),
            ...(description && { description }),
            ...(githubUrl && { githubUrl }),
            ...(emojis && { emojis }),
            ...(deployedUrl && { deployedUrl })
        };

        const updated = await Project.updateOne({ _id: projectId }, newProject);

        return res.status(200).json(updated);
    } catch (err) {
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

controller.post('/', createProject);
controller.get('/all', getAllProjects);
controller.put('/:projectId', updateProject);
// controller.get('/me', getMyProjects);
// controller.get('/:id', getProjectsByUserId);

module.exports = controller;
