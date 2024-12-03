
const Users = require("../model/usersSchema");
const Product = require("../model/productsSchema");
const Favourates = require("../model/favourateSchema");

const addFavourate = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "Please provide both userId and productId" });
        }

        const existuser = await Users.findOne({ _id: userId });

        const existproduct = await Product.findOne({ _id: productId });
        
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
        const {userId} = req.params;
 
       //    favourate id is passing in the params

        const findfavourate = await Favourates.findOneAndDelete({_id:userId });

        if( !userId || ! findfavourate   ){

            const message = !userId ? "userId not found" : "Favourate not found" 

            return res.status(400).json({ message:message });
        }
        
        res.status(200).json({ message: "product removed from favourites", findfavourate });

    } catch (error) {
        
        console.log(error);

        res.status(500).json({ message: " internal server error" })
    }
};

const getFavourates = async (req, res) => {

    try {
        const {userId} = req.params;

        if (!userId) {
            return res.status(404).json({ message: "User id is required" });
        }

        const existuser = await Users.findById({ _id:userId });

        if (!existuser) {
            return res.status(404).json({ message: "User not found" });
        }
        const fav = await Favourates.find({ userId: userId });
        
        if(!fav){
            return res.status(404).json({ message: "No favourite product found" });
        }

        res.status(200).json({ message: "fetched all favourates", fav });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({ message: " internal server error" })
    }
}

module.exports = { addFavourate, removeFavourate, getFavourates };