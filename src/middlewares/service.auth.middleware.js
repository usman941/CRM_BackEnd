const jwt = require("jsonwebtoken");

const ServiceAuthMiddleware = (req, res, next) => {
    try {
        const token = req.cookies["msf-companyUser"];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = ServiceAuthMiddleware;