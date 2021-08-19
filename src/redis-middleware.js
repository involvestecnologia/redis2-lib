'use strict'

const RedisConnection = require('./redis-connection')

class RedisMiddleware {
  static async setRedisIntegration (req, _res, next) {
    const connection = await RedisConnection.getConnection(
      process.env.REDIS_URL,
      process.env.REDIS_PORT,
      process.env.REDIS_PASSWORD,
      process.env.REDIS_DB)
    if (!req.integrations) req.integrations = {}
    req.integrations.redis = connection
    next()
  }
}

module.exports = RedisMiddleware
