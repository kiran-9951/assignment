const Cart = require("../model/cartSchema")
const Users = require("../model/usersSchema");
const Product = require("../model/productsSchema");
const Orders = require("../model/ordersSchema")
const mongoose = require("mongoose")

const placeOrder = async (req, res) => {
    try {
        const { userId } = req.params;
        const finduser = await Users.findById(userId);
        if (!finduser) {
            return res.status(404).json({ message: "User not found" });
        }

        const findcart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate("products");

        if (!findcart || findcart.products.length === 0) {
            const message = !findcart ? "Cart is empty" : "No products in cart";
            return res.status(404).json({ message });
        }
        const cartAggregation = await Cart.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$products" },
            {
                $group: {
                    _id: null,
                    totalsum: {
                        $sum: { $multiply: ["$products.price", "$products.quantity"] }
                    }
                }
            }
        ]);

        if (!cartAggregation || cartAggregation.length === 0) {
            const message = !cartAggregation ? "Cart is empty" : "No products in cart";
            return res.status(400).json({ message: message });
        }
        const totalsum = cartAggregation[0].totalsum;

        const order = new Orders({
            userId: userId,
            products: findcart.products,
            totalsum: totalsum
        });
        await order.save();

        await Cart.findByIdAndDelete(findcart._id);

        res.status(201).json({ message: "Order placed successfully", order });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const getusersOrder = async (req, res) => {
    try {

        const { userId } = req.params;

        const finduser = await Users.findById(userId)
        console.log(finduser)
        if (!finduser) {
            return res.status(404).json({ message: "User not found" });
        }

        const findorder = await Orders.find({ userId: userId }).populate("products");
        console.log(findorder)
        if (!findorder) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({ message: "successfully fetched user orders", orders: findorder });

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}


const updateusersOrder = async (req, res) => {
    try {
        const { userId } = req.params; 
        const { productstatus, orderstatus } = req.body; 

      
        const finduser = await Users.findById(userId);
        if (!finduser) {
            return res.status(404).json({ message: "User not found" });
        }

       
        const findorder = await Orders.findOne({ userId }).populate("products");
        if (!findorder) {
            return res.status(404).json({ message: "No orders found" });
        }

       
        if (productstatus) {
            findorder.products.forEach((product) => {
                product.productstatus = productstatus; 
                product.save(); 
            });
        }

       
        if (orderstatus) {
            findorder.orderstatus = orderstatus; 
        }

     
        await findorder.save();

     
        res.status(200).json({ message: "Order and product status updated", order: findorder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { placeOrder, getusersOrder, updateusersOrder }