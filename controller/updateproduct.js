const fs = require("fs");
const filepath = "products.json";

const readDataFromFile = () => {
    try {
        const data = fs.readFileSync(filepath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        return [];
    }
};

const updateProduct = (req, res) => {

    const { id } = req.params;
    console.log("Product ID:", id);

    const { title, price, quantity, description } = req.body;
    const image = req.file ? req.file.filename : null;
    console.log("Uploaded Image:", image);

    let productDetails = readDataFromFile();
    console.log(productDetails)
    const product = productDetails.find((prod) => prod.id === id);
    console.log(product)

    if (!product) {
        return res.status(404).send({ message: "Product not found" });
    }

    product.title = title ? title : product.title;
    product.description = description ? description : product.description;
    product.price = price ? price : product.price;
    product.quantity = quantity ? quantity : product.quantity;

    if (image) {
        if (product.image) {
            const oldImagePath = `./uploads/${product.image}`
            if (oldImagePath) {
                fs.unlinkSync(oldImagePath)
            }
        }
        product.image = image
    }

    try {
        fs.writeFileSync(filepath, JSON.stringify(productDetails, null, 2));
        return res.status(200).send({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error writing file:", error);
        return res.status(500).send({ message: "Error updating product" });
    }
};

module.exports = updateProduct;

