const mongoose = require("mongoose")
const favourateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    }
}, { timestamps: true })

const Favourates = mongoose.model("Favourates", favourateSchema);
module.exports = Favourates;