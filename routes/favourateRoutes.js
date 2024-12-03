const express = require("express");
const router = express.Router();
const favourateController = require("../controllers/favourateController");
const verify = require("../middilewares/authentication")
router.post("/addfavourate", verify,favourateController.addFavourate);
router.delete("/removefavourate/:userId",verify,favourateController.removeFavourate);
router.get("/getfavourates/:userId",verify,favourateController.getFavourates)
module.exports = router;