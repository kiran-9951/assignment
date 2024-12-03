const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        const uniquepath = `${file.originalname}`
        cb(null, uniquepath)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedtypes = ["image/jpg", "image/png", "image/jpeg"]
    if (allowedtypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
       cb(new Error("only jpeg ,jpg ,png are allowed"),false)
    }
}
const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize:2 * 1024 * 1024
    }
})
module.exports = upload