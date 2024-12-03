const fs = require("fs")
const filepath = "products.json"


const readDataFromFile = () => {

    if (fs.existsSync(filepath)) {

        const data = fs.readFileSync(filepath, "utf-8");

        return JSON.parse(data)
    }
    return []
}

const allproducts = (req, res) => {
    
    const products = readDataFromFile()

    if (products.length === 0) {
        res.status(404).send({ message: "No products available" })
    }

    return res.status(200).json({ message: "products fetched", products: products })
}

module.exports = allproducts