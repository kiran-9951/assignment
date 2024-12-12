const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const directory = "uploads";
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        cb(null, directory);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${file.originalname}`;
        cb(null, uniqueName);
    },
});



const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        // Create a custom error for unsupported file types
        const error = new Error("Unsupported file type. Only jpeg, jpg, and png are allowed.");
        error.code = "UNSUPPORTED_FILE_TYPE"; // Custom error code
        cb(error, false); // Reject the file
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 }, // 2MB limit
});

module.exports = upload;
