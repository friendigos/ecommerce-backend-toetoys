// routes/cartRoutes.js

const express = require('express');
const { addToCart, updateCartItem, removeFromCart, getCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

const router = express.Router();

// Routes
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove/:cartItemId', protect, removeFromCart);
router.get('/', protect, getCart);

module.exports = router;
