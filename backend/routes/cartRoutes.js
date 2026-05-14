const express = require("express");

const router = express.Router();

const {
    addToCart,
    getCartItems,
    removeCartItem,
} = require("../controllers/cartController");

router.post("/add", addToCart);

router.get("/:userId", getCartItems);

router.delete("/:id", removeCartItem);

module.exports = router;