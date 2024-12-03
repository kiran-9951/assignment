const jwt = require("jsonwebtoken")
const verifytoken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(403).json({ message: "Forbidden: No token provided" });
        }
        if (req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            // console.log(token)
            const decoded = jwt.verify(token, "secretkey123");
            // console.log(decoded)
            req.user = decoded;
            // console.log(req.user)
            next()
        } else {
            return res.status(401).json({ message: "Unauthorized please login" })
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: " error occuring while verifying token" })
    }
}


module.exports = verifytoken;