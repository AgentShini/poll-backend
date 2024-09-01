const Poll = require('../models/Poll');
const { wss } = require('../app');
const { sendNotification } = require('../services/emailService');

exports.createPoll = async (req, res) => {
    const { question, options, endTime } = req.body;
    const userId = req.user.id;
    try {
        const poll = await Poll.create({ question, options, endTime, createdBy: userId });
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPolls = async (req, res) => {
    try {
        const polls = await Poll.find().populate('createdBy', 'username');
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.votePoll = async (req, res) => {
    const { id } = req.params;
    const { selectedOption } = req.body;
    try {
        const poll = await Poll.findById(id);
        poll.options[selectedOption].votes++;
        await poll.save();

        // Emit event to WebSocket clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'voteUpdated', poll }));
            }
        });

        sendNotification(poll); // Example: send email notification
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPollAnalytics = async (req, res) => {
    const { id } = req.params; // Poll ID
    try {
        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);
        const mostVotedOption = poll.options.reduce((max, option) => (option.votes > max.votes ? option : max), poll.options[0]);

        const analytics = {
            totalVotes,
            mostVotedOption: {
                text: mostVotedOption.text,
                votes: mostVotedOption.votes,
                percentage: ((mostVotedOption.votes / totalVotes) * 100).toFixed(2),
            },
            options: poll.options.map(option => ({
                text: option.text,
                votes: option.votes,
                percentage: ((option.votes / totalVotes) * 100).toFixed(2)
            }))
        };

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
