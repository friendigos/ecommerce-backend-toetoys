// app.js

// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');


// Load environment variables from .env file
dotenv.config();    

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables CORS
app.use(morgan('dev')); // Logs HTTP requests

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Placeholder for routes
app.use('/api/users', require('./routes/userRoutes')); // User routes
app.use('/api/products', require('./routes/productRoutes')); // Product routes
app.use('/api/cart', require('./routes/cartRoutes')); // Cart routes
app.use('/api/orders', require('./routes/orderRoutes')); // Order routes
app.use('/api/otp', require('./routes/otpRoutes'));s

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
