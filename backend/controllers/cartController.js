const Cart = require("../models/Cart");

const addToCart = async (req, res) => {

    try {

        const { user, product, quantity } = req.body;

        const existingCartItem = await Cart.findOne({
            user,
            product,
        });

        if (existingCartItem) {

            existingCartItem.quantity += quantity || 1;

            await existingCartItem.save();

            return res.status(200).json({
                message: "Cart updated",
                cart: existingCartItem,
            });
        }

        const newCartItem = new Cart({
            user,
            product,
            quantity,
        });

        await newCartItem.save();

        res.status(201).json({
            message: "Product added to cart",
            cart: newCartItem,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getCartItems = async (req, res) => {

    try {

        const cartItems = await Cart.find({
            user: req.params.userId,
        }).populate("product");

        res.status(200).json(cartItems);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const removeCartItem = async (req, res) => {

    try {

        await Cart.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Cart item removed",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
module.exports = {
    addToCart,
    getCartItems,
    removeCartItem,
};