const authControllers = require("../controllers/authControllers")
const express = require("express");
const router = express.Router();
const upload = require("../middilewares/multer")

router.post("/signup",upload.single("image"), authControllers.Signup);
router.post("/login", authControllers.Login);

module.exports = router;
