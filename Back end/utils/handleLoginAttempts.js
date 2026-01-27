const redis = require('../config/redis');

const MAX_ATTEMPTS = 5

const handleFailedLogin = async (user,ip) => {

  const key = `login:${user}:${ip}`;
  const data = await redis.get(key);

  let attempts = 1;
  let block = 0;

  if(data){
    const paresd = JSON.parse(data);
    attempts = paresd.attempts + 1;
    block = paresd.block || 0;
  }
  let blockedUntil = null;

  if(attempts >= MAX_ATTEMPTS){
    block += 1;
    blockedUntil = Date.now() + Math.pow(2,block) * 60 * 60 * 1000;
    attempts = 0;
  }
  await redis.set(key, JSON.stringify({
    attempts,
    block,
    blockedUntil
  }), "EX", 60 * 24 * 60);

}

const resetLoginAttempts = async (user, ip) => {
  await redis.del(`login:${user}:${ip}`);
}

module.exports = {
  resetLoginAttempts, 
  handleFailedLogin
};