const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            productstatus: {
                type: String,
                enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
                default: "Pending"
            }
        }
    ],
    totalsum: {
        type: Number,
        required: true
    },
    orderstatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing"
    }
}, { timestamps: true })

const Orders = mongoose.model("Orders", orderSchema);
module.exports = Orders;