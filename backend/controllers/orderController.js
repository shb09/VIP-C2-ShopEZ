const Order = require("../models/Order");

const placeOrder = async (req, res) => {

    try {

        const {
            user,
            products,
            totalPrice,
            paymentMethod,
            shippingAddress,
        } = req.body;

        const newOrder = new Order({
            user,
            products,
            totalPrice,
            paymentMethod,
            shippingAddress,
        });

        await newOrder.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: newOrder,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getUserOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.params.userId,
        })
        .populate("products.product")
        .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()
        .populate("user")
        .populate("products.product")
        .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
const updateOrderStatus = async (req, res) => {

    try {

        const { orderStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderStatus,
            },
            {
                new: true,
            }
        );

        if (!updatedOrder) {

            return res.status(404).json({
                message: "Order not found",
            });
        }

        res.status(200).json({
            message: "Order status updated",
            order: updatedOrder,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
module.exports = {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
};