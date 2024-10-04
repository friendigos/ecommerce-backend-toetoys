// routes/userRoutes.js

const express = require('express');
const { registerUser, loginUser, googleLogin } = require('../controllers/userController');

const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

module.exports = router;
