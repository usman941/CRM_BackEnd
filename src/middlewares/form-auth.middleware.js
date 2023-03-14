const jwt = require("jsonwebtoken");

const FormAuthMiddleware = (req, res, next) => {
    try {
        const token = req.cookies["refToken"];
        if (!token) {
            return res.redirect("/portal/login/unauthorized");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.ref = decoded;
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            res.clearCookie('refToken');
            return res.redirect("/portal/login/unauthorized");
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = FormAuthMiddleware;