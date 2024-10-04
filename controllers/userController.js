// controllers/userController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User Registration
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, phone });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Google OAuth Authentication
exports.googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email_verified, name, email } = ticket.getPayload();

        if (email_verified) {
            let user = await User.findOne({ email });

            if (!user) {
                user = new User({ name, email, password: 'google_oauth', googleId: ticket.getUserId() });
                await user.save();
            }

            const token = generateToken(user);
            res.json({ token, user });
        } else {
            res.status(400).json({ message: 'Google login failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
