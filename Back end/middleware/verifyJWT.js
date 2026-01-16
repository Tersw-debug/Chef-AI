const jwt = require('jsonwebtoken')
require('dotenv').config();

const verfiyJWT = (req,res,next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) return res.sendStatus(401);
    console.log(authHeader);


    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY,
        (err, decoded) => {
            console.log(err);
            if(err) return res.sendStatus(403);
            req.user = decoded.username;
            next();
        }
    );
}

module.exports = verfiyJWT;