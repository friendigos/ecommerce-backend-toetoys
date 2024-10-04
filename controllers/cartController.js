// controllers/cartController.js

const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; // Assuming the user is authenticated and req.user contains the user info

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if cart item already exists for the user
        let cartItem = await Cart.findOne({ product: productId, user: userId });

        if (cartItem) {
            // If item already exists, update the quantity
            cartItem.quantity += quantity;
            cartItem.price = cartItem.quantity * product.price; // Update price based on quantity
        } else {
            // Create new cart item
            cartItem = new Cart({
                product: productId,
                quantity,
                price: quantity * product.price,
                user: userId,
            });
        }

        await cartItem.save();

        // Update user's cart reference
        await User.findByIdAndUpdate(userId, { $push: { cart: cartItem._id } });

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
    try {
        const { cartItemId, quantity } = req.body;

        let cartItem = await Cart.findById(cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Update quantity and price
        cartItem.quantity = quantity;
        cartItem.price = cartItem.quantity * cartItem.product.price;

        await cartItem.save();

        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.user.id;

        const cartItem = await Cart.findById(cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Remove cart item
        await Cart.findByIdAndDelete(cartItemId);

        // Update user's cart reference
        await User.findByIdAndUpdate(userId, { $pull: { cart: cartItemId } });

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate({
            path: 'cart',
            populate: {
                path: 'product',
                model: 'Product',
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
