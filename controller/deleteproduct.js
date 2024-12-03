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

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    const productdetails = readDataFromFile();

    const productIndex = productdetails.findIndex((prod) => prod.id === id);

    if (productIndex === -1) {

        return res.status(404).json({ message: "Product not found" });
    }

    const product = productdetails[productIndex];

   
    if (product.image) {
        // Extract the filename from the URL

        const imagePath = product.image.split('/uploads/')[1];

        const fullImagePath = `./uploads/${imagePath}`;

        if (fs.existsSync(fullImagePath)) {
            try {
                fs.unlinkSync(fullImagePath);

                console.log("Image deleted successfully:", fullImagePath);

            } catch (err) {

                console.error("Error deleting image:", err);
            }
        } else {
            console.log("Image file not found:", fullImagePath);
        }
    }

    // Remove product from the JSON file
    const deletedProduct = productdetails.splice(productIndex, 1);

    try {

        fs.writeFileSync(filepath, JSON.stringify(productdetails, null, 2), "utf8");

        res.status(200).json({ message: "Product deleted successfully", deletedProduct });

    } catch (error) {

        console.error("Error writing file:", error);
        
        res.status(500).json({ message: "Error deleting product", error });
    }
};


module.exports = deleteproduct;
