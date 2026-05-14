const express = require("express");

const router = express.Router();

const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/orderController");

router.post("/place", placeOrder);

router.get("/user/:userId", getUserOrders);

router.get("/", getAllOrders);
router.put("/:id",updateOrderStatus);
module.exports = router;