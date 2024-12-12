const jwt = require("jsonwebtoken");

const verifytoken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(403).json({ message: "Forbidden: No token provided" });
        }

        if (req.headers.authorization.startsWith("Bearer")) {
            
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, "secretkey123");
            req.user = decoded;
            next();
        }
         else {
            return res.status(401).json({ message: "Unauthorized: Invalid token format" });
        }
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid token signature" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        console.error(error);
        res.status(500).json({ message: "Error occurred while verifying token" });
    }
};

module.exports = verifytoken;
