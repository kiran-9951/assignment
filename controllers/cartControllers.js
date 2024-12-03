const Cart = require("../model/cartSchema")
const Users = require("../model/usersSchema");
const Product = require("../model/productsSchema");
const mongoose = require("mongoose")

const addToCart = async (req, res) => {
    try {

        const { userId, productId, quantity } = req.body;

        const user = await Users.findById({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const product = await Product.findById({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            cart = new Cart({
                userId: userId,
                products: [
                    {
                        productId: productId,
                        quantity: quantity,
                        price: product.price
                    }
                ]
            })
        } else {
            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

            if (productIndex > -1) {
                if (quantity > 0) {
                    cart.products[productIndex].quantity += quantity
                } else {
                    cart.products.splice(productIndex, 1)
                }
            } else {
                if (quantity > 0) {
                    cart.products.push({
                        productId: productId,
                        quantity: quantity,
                        price: product.price
                    })

                }
            }
        }
        const savecart = await cart.save()
        res.status(201).json({ message: "product added to cart", data: savecart })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}

const getFromCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const userExist = await Users.findById(userId);
        
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        const foundCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

        if (!foundCart) {
            return res.status(404).json({ message: "Cart not found for this user" });
        }

        const cart = await Cart.aggregate([

            { $match: { userId: new mongoose.Types.ObjectId(userId) } },

            { $unwind: "$products" },
            {
                $addFields: {
                    totalPrice: { $multiply: ["$products.price", "$products.quantity"] }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    products: { $push: "$products" },
                    totalSum: { $sum: "$totalPrice" }
                }
            }
        ]);

        if (!cart || cart.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }


        res.status(200).json({
            message: "Products fetched from cart",
            totalSum: cart[0].totalSum,
            products: cart[0].products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const removeFromCart = async (req, res) => {
    try {

        const { userId, productId } = req.body;
        
        const userExist = await Users.findById(userId);
        
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        const cart = await Cart.findOne({ userId: userId })

        if (!cart) {
            return res.status(404).json({ message: "cart not found for user" })
        }

        cart.products = cart.products.filter((item) => item.productId.toString() !== productId)


        await cart.save();

        res.status(200).json({ message: "product removed from cart" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}


module.exports = { addToCart, removeFromCart, getFromCart }
