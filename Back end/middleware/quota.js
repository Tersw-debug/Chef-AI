const GUEST_LIMIT = 10;
const USER_LIMIT = 50;
const RESET = 24 * 60 * 60;

const Redis = require("ioredis");
const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});


const quotaMiddleware = async (req, res, next) => {
  try {
    let key, limit;

    if (req.user) {
      key = `quota:user:${req.user.id}`;
      limit = USER_LIMIT;
    } else {
      key = `quota:guest:${req.ip}`;
      limit = GUEST_LIMIT;
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
