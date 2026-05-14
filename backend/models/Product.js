const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    images: [
        {
            type: String,
        },
    ],
    sizes: [
        {
            type: String,
        },
    ],
    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
{
    timestamps: true,
}
);
module.exports = mongoose.model("Product", productSchema);