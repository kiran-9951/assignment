
const Users = require("../model/usersSchema");
const Product = require("../model/productsSchema");
const Favourates = require("../model/favourateSchema");
const mongoose = require("mongoose")

const addFavourate = async (req, res) => {

    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "Please provide both userId and productId" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId) || userId.length !== 24) {
            return res.status(404).json({ message: "invaild user id" })
        }

        if (!mongoose.Types.ObjectId.isValid(productId) || productId.length !== 24) {
            return res.status(404).json({ message: "invaild product id" })
        }

        const existuser = await Users.findById({ _id: userId });

        const existproduct = await Product.findById({ _id: productId });

        if (!existuser || !existproduct) {

            const message = !existuser ? "User does not exist" : "Product does not exist";

            return res.status(400).json({ message: message });
        };


        const existfavourate = await Favourates.findOne({ userId, productId })

        if (existfavourate) {
            return res.status(400).json({ message: "Product already favourated" });
        }

        const fav = new Favourates({
            userId,
            productId
        })
        await fav.save()

        res.status(201).json({ message: "product added to favouartes", data: fav });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: " internal server error" })
    }
}


const removeFavourate = async (req, res) => {

    try {
        const { favorateId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(favorateId) || favorateId.length !== 24) {
            return res.status(404).json({ message: "invaild favorate id" })
        }

        const findfavourate = await Favourates.findOneAndDelete({ _id: favorateId });

        if (!favorateId || !findfavourate) {

            const message = !userId ? "userId not found" : "Favourate not found"

            return res.status(400).json({ message: message });
        }

        res.status(200).json({ message: "product removed from favourites", findfavourate });

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: " internal server error" })
    }
};

const getFavourates = async (req, res) => {

    try {

        // Extract user ID from req.user set by verifytoken middleware

        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId) || userId.length !== 24) {
            return res.status(404).json({ message: "invaild favorate id" })
        }

        const existUser = await Users.findById(userId);

        if (!existUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const fav = await Favourates.find({ userId });

        if (!fav || fav.length === 0) {
            return res.status(404).json({ message: "No favourite product found" });
        }

        res.status(200).json({ message: "Fetched all favourites", fav });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });

    }
};


module.exports = { addFavourate, removeFavourate, getFavourates };