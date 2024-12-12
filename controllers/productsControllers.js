const Products = require("../model/productsSchema");
const Favourates = require("../model/favourateSchema")
const Cart = require("../model/cartSchema")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const addProducts = async (req, res) => {
    try {
        const { title, price, description, category, quantity } = req.body;

        if (!title || !price || !description || !category) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const image = req.file ? req.file.filename : null;
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${image}`;

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const product = new Products({
            title,
            price,
            description,
            category,
            quantity,
            image: imageUrl
        })

        await product.save()
        res.status(201).json({ message: "product created succesfully", status: "success", products: product })

    }
    catch (error) {
        
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}

const getallProduct = async (req, res) => {
   
    try {

        const allproducts = await Products.find();

        if (allproducts.length === 0) {
            return res.status(404).json({ message: "products are not available" })
        }

        res.status(200).json({ message: "products fetched", status: "success", products: allproducts })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" })
    }
}

const getProduct = async (req, res) => {
    
    try {

        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
            return res.status(404).json({ message: "invaild product id" })
          }

        if (!id) {
            return res.status(400).json({ message: "Please provide product id" })
        }

        const foundproduct = await Products.findById(id)

    
        if (!foundproduct) {
            return res.status(404).json({ message: "product not found" })
        }
        res.status(200).json({ message: "product fectched", status: "success", products: foundproduct })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" })
    }
}
const updateProduct = async (req, res) => {
    try {
        const { title, price, description, category, quantity } = req.body;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Please provide product id" });
        }

        if(!mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
            return res.status(404).json({ message: "invaild product id" })
          }

        const existproduct = await Products.findById(id);
        if (!existproduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const image = req.file ? req.file.filename : null;
        const imageUrl = image ? `${req.protocol}://${req.get("host")}/uploads/${image}` : null;

        // Delete the old image if a new one is uploaded
        if (image && existproduct.image) {
            const oldImageFileName = existproduct.image.split('/uploads/')[1]; // Extract filename from the URL
            const oldImagePath = path.join(__dirname, "..", "uploads", oldImageFileName);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Delete the old image file
            }
        }

        // Update the product fields
        existproduct.title = title || existproduct.title;
        existproduct.price = price || existproduct.price;
        existproduct.description = description || existproduct.description;
        existproduct.quantity = quantity || existproduct.quantity;
        existproduct.category = category || existproduct.category;
        existproduct.image = imageUrl || existproduct.image;

        await existproduct.save();

        res.status(200).json({ message: "Product updated successfully", status: "success", products: existproduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteProduct = async (req, res) => {
    
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Please provide product id" });
        }

        if(!mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
            return res.status(404).json({ message: "invaild product id" })
          }
        const product = await Products.findByIdAndDelete(id);
       
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check and delete the associated image file
        if (product.image) {
            const imageFileName = product.image.split('/uploads/')[1]; // Extract filename from the URL
            const imagePath = path.join(__dirname, "..", "uploads", imageFileName);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath); // Delete the image file
                    console.log(`Image deleted: ${imagePath}`);
                } catch (err) {
                    console.error("Error deleting image:", err);
                }
            } else {
                console.warn(`Image file not found at: ${imagePath}`);
            }
        }
      

        await Favourates.deleteMany({productId:id})

        await Cart.deleteMany({productId:id})

        res.status(200).json({ message: "Product deleted successfully", status: "success", products: product });
    } 
    catch (error) {
        console.log("Error in deleteProduct:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { addProducts, updateProduct, getProduct, getallProduct, deleteProduct }