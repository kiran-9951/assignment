const express = require("express");
const app = express();
const PORT = 5050;
const path = require("path")
const dotenv=require("dotenv");
dotenv.config({path:"./configuration/config.env"});
const Database = require("./configuration/Database");
const productsRoutes = require("./routes/productsRoutes");
const userRoutes = require("./routes/authRoutes");
const favourateRoutes = require("./routes/favourateRoutes")
const cartRoutes = require("./routes/cartRoutes")
const ordersRoutes = require("./routes/ordersRoutes");


Database()

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/surveyheart", favourateRoutes)
app.use("/surveyheart", productsRoutes)
app.use("/surveyheart", userRoutes)
app.use("/surveyheart", cartRoutes)
app.use("/surveyheart", ordersRoutes)




app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})

module.exports = app;