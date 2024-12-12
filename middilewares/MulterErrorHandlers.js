const multer = require("multer");

const MulterErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size is too large. Maximum allowed size is 2MB.",
            });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "Unexpected file uploaded.",
            });
        }
    } else if (err.code === "UNSUPPORTED_FILE_TYPE") {
        // Custom error for unsupported file types
        return res.status(400).json({
            message: err.message, // e.g., "Unsupported file type. Only jpeg, jpg, and png are allowed."
        });
    } else if (err) {
        // Handle all other errors
        return res.status(500).json({
            message: "An error occurred during file upload.",
            error: err.message,
        });
    }

    next(); // Proceed if no error
};

module.exports = MulterErrorHandler;
