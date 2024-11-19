const express = require("express");
const router = express.Router();

const upload = require("../middlewares/multeruploads");
const addproduct = require("../controller/addproduct");
const getproduct = require("../controller/getproduct");
const deleteproduct = require("../controller/deleteproduct");
const updateproduct = require("../controller/updateproduct");


router.post("/addproduct", upload.single("image"), addproduct);
router.get("/getproduct/:id", getproduct);
router.put("/updateproduct/:id",upload.single("image"), updateproduct);
router.delete("/deleteproduct/:id", deleteproduct);

module.exports = router;
