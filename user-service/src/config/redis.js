const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}`
});

redisClient.connect();

module.exports = redisClient; 