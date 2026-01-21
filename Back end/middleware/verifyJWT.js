const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // No token → guest
    if (!authHeader?.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
        if (err) {
            req.user = null;
            req.roles = null;
            return next();
        }

        req.user = {
            id: decoded.UserInfo.id,
            username: decoded.UserInfo.username
        };

        req.roles = decoded.UserInfo.roles;

        next();
    });
};

module.exports = verifyJWT;
