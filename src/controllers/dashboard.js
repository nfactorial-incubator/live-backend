const express = require('express');
const { getUsernameByMap, getValueByUsername } = require('../api/mappings');

const GithubAPI = require('../api/githubAPI.js');
const WakaAPI = require('../api/wakaAPI.js');

const controller = express.Router();

const githubAPI = new GithubAPI();
const wakaAPI = new WakaAPI();

const getDashboard = async (req, res) => {
    const orgRepos = await githubAPI.getRepositories();

    
    const repoStats = await Promise.all(
        orgRepos.map(async (repo) => {
            const commitsCount = await githubAPI.getRepoCommitsCount(repo.name);
            const username = getUsernameByMap('repoName', repo.name)
            const wakaUsername = getValueByUsername('wakaapi', username);
            const wakaData = await wakaAPI.getUserStats(wakaUsername);

            return {
                ...repo,
                commits: {
                    commitsCount
                },
                activity: wakaData
            };
        })
    );
    res.send(repoStats);
};

controller.get('/', getDashboard);

module.exports = controller;
