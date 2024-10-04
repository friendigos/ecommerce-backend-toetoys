// controllers/otpController.js

const twilio = require('twilio');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Generate OTP (in a real application, you'd store this OTP in a database with an expiry time)
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Send OTP using Twilio
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });

        // Store OTP and phone number (In a real app, store this in the database with an expiry time)
        req.session.otp = otp;
        req.session.phoneNumber = phoneNumber;

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP
exports.verifyOTP = (req, res) => {
    try {
        const { otp } = req.body;

        // Verify OTP (In a real app, compare with stored OTP)
        if (otp == req.session.otp) {
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
