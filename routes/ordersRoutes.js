const express = require('express');
const router = express.Router();
const verify = require("../middilewares/authentication")
const restrict = require("../middilewares/authorization")
const ordersControllerss = require("../controllers/ordersControllers")
router.post("/placeorder/:userId",verify, ordersControllerss.placeOrder)
router.get("/getuserorder/:userId", verify,ordersControllerss.getusersOrder)
router.put("/updateorder/:userId", verify, restrict("admin"), ordersControllerss.updateusersOrder)
module.exports = router;