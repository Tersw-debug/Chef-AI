const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    
    if (!authHeader?.startsWith("Bearer ")) {
        req.UserInfo = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err) {
            req.UserInfo = null;
            return next();
        }

        req.UserInfo = {
            id: decoded.UserInfo.id,
            username: decoded.UserInfo.username,
            role: decoded.UserInfo.role
        };
        next();
    });
};

module.exports = verifyJWT;
