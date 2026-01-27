const redis = require('../config/redis');

const loginLimiter = async (req, res,next) => {
    const {user} = req.body;
    const ip = req.ip;

    const key = `login:${user}:${ip}`;
    const data = await redis.get(key);

    if(!data) return next();

    const paresd = JSON.parse(data);

    if(paresd.blockedUntil && Date.now() < paresd.blockedUntil){
        return res.status(429).json({
            message:`Too many login attempts. Please try again later.`
        });
    }


    next();
}

module.exports = loginLimiter;