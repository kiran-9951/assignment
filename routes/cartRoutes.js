
const express = require("express");
const router = express.Router();
const cartControllers = require("../controllers/cartControllers")
const verify = require("../middilewares/authentication")
router.post("/addtocart",verify,cartControllers.addToCart);
router.get("/getfromcart/:userId",verify,cartControllers.getFromCart)
router.delete("/removefromcart",verify,cartControllers.removeFromCart);


module.exports = router;