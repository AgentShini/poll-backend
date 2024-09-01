const express = require('express');
const { createPoll, getPolls, votePoll, getPollAnalytics } = require('../controllers/pollController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createPoll); // Protected route to create a poll
router.get('/', getPolls); // Public route to get all polls
router.put('/vote/:id', votePoll); // Public route to vote on a poll
router.get('/analytics/:id', getPollAnalytics); // Public route to get poll analytics

module.exports = router;
