const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const pollRoutes = require('./routes/pollRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/polls', pollRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Set up WebSocket for real-time updates
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
});

module.exports = { wss };  // Export wss to use in the controller
