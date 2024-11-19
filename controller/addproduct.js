const fs = require("fs")
const filepath = "products.json"


const readDataFromFile = () => {
    if (fs.existsSync(filepath)) {
        const data = fs.readFileSync(filepath, "utf-8");
        return JSON.parse(data)
    }
    return []
}

const addproduct = (req, res) => {
    const { id, title, price, quantity, description } = req.body;

    if (!title || !price || !quantity || !description) {
        res.status(404).json({ message: "all fields are required" })
    }
    const image = req.file ? req.file.filename : null

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${image}`

    if (!image) {
        res.status(404).json({ message: "image not found" })
    }
    const product = { id, title, price, quantity, description, image:imageUrl }

    const productdetails = readDataFromFile()
    
    productdetails.push(product);

  
    fs.writeFile(filepath, JSON.stringify(productdetails, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to save data to file" });
        }
        res.status(201).json({ message: "Product added successfully", product });
    });
    
}
module.exports = addproduct

