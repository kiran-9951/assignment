const Products = require("../model/productsSchema");
const fs = require("fs")
const path = require("path")
const addProducts = async (req, res) => {
    try {
        const { title, price, description, category } = req.body;
        
        if (!title || !price || !description || !category) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const image = req.file ? req.file.filename : null;
        const imageUrl = `uploads/${image}`
        if (!image) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const product = new Products({
            title,
            price,
            description,
            category,
            image: imageUrl
        })
        await product.save()
        res.status(201).json({ message: "product created succesfully", status: "success", products: product })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}

const getallProduct = async (req, res) => {
    try {

        const allproducts = await Products.find()
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

        const { title, price, description, category } = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Please provide product id" })
        }


        const existproduct = await Products.findById(id);
        if (!existproduct) {
            return res.status(404).json({ message: "product not found" })
            
        }
        const image = req.file ? req.file.filename : null
        const imageUrl = `uploads/${image}`
        if (image && existproduct.image) {
            const imagepath = path.join(__dirname, "..", existproduct.image);
            if (fs.existsSync(imagepath)) {
                fs.unlinkSync(imagepath)
            }
        }
        existproduct.title = title || existproduct.title;
        existproduct.price = price || existproduct.price
        existproduct.description = description || existproduct.description
        existproduct.category = category || existproduct.category
        existproduct.image = imageUrl || existproduct.image


        await existproduct.save();
        res.status(200).json({ message: "product updated", status: "success", products: existproduct })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Please provide product id" });
        }

        const product = await Products.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check and delete the associated image file
        if (product.image) {
            const imagePath = path.join(__dirname, "..", product.image);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                    console.log(`Image deleted: ${imagePath}`);
                } catch (err) {
                    console.error("Error deleting image:", err);
                }
            } else {
                console.warn(`Image not found at: ${imagePath}`);
            }
        }

        res.status(200).json({ message: "Successfully deleted", status: "success", products: product });
    } catch (error) {
        console.log("Error in deleteProduct:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { addProducts, updateProduct, getProduct, getallProduct, deleteProduct }