const express = require("express");
const router = express.Router();
const upload = require("../middilewares/multer")
const productsController = require("../controllers/productsControllers");
const verify = require("../middilewares/authentication");
const restrict = require("../middilewares/authorization")
const MulterErrorHandler = require("../middilewares/MulterErrorHandlers")
router.post("/addproduct", upload.single("image"),MulterErrorHandler, productsController.addProducts);
router.get("/allproducts",  productsController.getallProduct)
router.get("/getproduct/:id",  productsController.getProduct)
router.put("/updateproduct/:id", upload.single("image"), verify, restrict("admin"), productsController.updateProduct);
router.delete("/deleteproduct/:id", verify, restrict("admin"), productsController.deleteProduct);

module.exports = router;