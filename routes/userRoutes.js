const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser); // Public route to register a new user
router.post('/login', loginUser); // Public route to login a user

module.exports = router;
