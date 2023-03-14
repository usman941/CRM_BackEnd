const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
          res.status(401).json({
            success: false,
            message: "Authorization Required",
          });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
};
module.exports = AuthMiddleware;