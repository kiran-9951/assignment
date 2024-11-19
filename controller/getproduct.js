const fs = require("fs");
const filepath = "products.json";
const readDataFromFile = () => {
    if (fs.existsSync(filepath)) {
        const data = fs.readFileSync(filepath, "utf8");
        return JSON.parse(data);
    }
    return [];
}
const getproduct = (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Title is required" });
        }

        const productdetails = readDataFromFile();

        const findproduct = productdetails.find((product) => product.id === id);

        if (!findproduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product fetched successfully", product: findproduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = getproduct;
