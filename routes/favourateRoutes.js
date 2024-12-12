const express = require("express");
const router = express.Router();
const favourateController = require("../controllers/favourateController");
const verify = require("../middilewares/authentication")
router.post("/addfavourate",favourateController.addFavourate);
router.delete("/removefavourate/:favorateId",favourateController.removeFavourate);
router.get("/getfavourates",verify,favourateController.getFavourates)
module.exports = router;