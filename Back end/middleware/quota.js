const jwt = require('jsonwebtoken');
require('dotenv').config();
const GUEST_LIMIT = 10;
const USER_LIMIT = 50;
const RESET = 24 * 60 * 60;

const redis = require('../config/redis');

const quotaMiddleware = async (req, res, next) => {
  try {
    let key, limit;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      key = `quota:guest:${req.ip}`;
      limit = GUEST_LIMIT;
    }
    
    else {
      const token = authHeader.split(' ')[1];
      console.log(jwt.decode(token));
      try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        req.UserInfo = decoded.UserInfo;
        key = `quota:user:${req.UserInfo.id}`;
        limit = USER_LIMIT;
      }catch(err){
        console.log(err);
        if(err.name == 'TokenExpiredError'){
          return res.status(401).json({ error: "Expired" });
        }
        return res.status(403).json({ error: "Invalid Token" });
      }
    }

    const current = await redis.get(key);

    if (!current) {
      await redis.set(key, 1, "EX", RESET);
      return next();
    }

    if (parseInt(current, 10) >= limit) {
      return res.status(429).json({
        error: "Prompt limit exceeded",
      });
    }

    await redis.incr(key);
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = quotaMiddleware;
