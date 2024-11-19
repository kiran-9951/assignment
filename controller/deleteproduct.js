const fs = require("fs");
const filepath = "products.json";


const readDataFromFile = () => {
    if (fs.existsSync(filepath)) {
        const data = fs.readFileSync(filepath, "utf8");
        return JSON.parse(data);
    }
    return [];
};

const deleteproduct = (req, res) => {
    const {id}  = req.params

    if (!id) {
        return res.status(400).json({ message: "Title is required" });
    }
    const productdetails = readDataFromFile();
    const productindex = productdetails.findIndex(
        (prod) => prod.id=== id
    );
    if (productindex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const product =productdetails[productindex]
    if(product.image){
        const imagepath =`./uploads/${product.image}`
        if (fs.existsSync(imagepath)) {
            try {
                fs.unlinkSync(imagepath);
                console.log("Image deleted successfully");
            } catch (err) {
                console.error("Error deleting image:", err);
            }
        } else {
            console.log("Image file not found:", imagepath);
        }
    }

    const deletedProduct = productdetails.splice(productindex, 1);
    try {
        fs.writeFileSync(filepath, JSON.stringify(productdetails, null, 2), "utf8");
        res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product", error });
    }
};

module.exports = deleteproduct;
