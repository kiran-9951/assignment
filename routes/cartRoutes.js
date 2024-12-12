
const express = require("express");
const router = express.Router();
const cartControllers = require("../controllers/cartControllers")
// const verify = require("../middilewares/authentication")
router.post("/addtocart",cartControllers.addToCart);
router.get("/getfromcart/:userId",cartControllers.getFromCart)
router.delete("/removefromcart",cartControllers.removeFromCart);


module.exports = router;