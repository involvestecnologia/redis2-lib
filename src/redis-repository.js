'use_strict'

const RedisConnection = require('./redis-connection')

class RedisRepository {
  static async setConnection () {
    if (this.connection) return

    this.connection = await RedisConnection.getConnection(
      process.env.REDIS_URL,
      process.env.REDIS_PORT,
      process.env.REDIS_PASSWORD,
      process.env.REDIS_DB)
  }

  static async incrKey (key) {
    await this.setConnection()
    return this.connection.incr(key)
  }

  static async getIncrKey (key) {
    await this.setConnection()
    const value = await this.connection.get(key)

    if (value === null) return 0

    const result = parseInt(value, 10)

    if (isNaN(result)) return 0

    return result
  }

  static async getKey (key) {
    await this.setConnection()
    return this.connection.get(key)
  }

  static async setKey (key, value) {
    await this.setConnection()
    return this.connection.set(key, value)
  }

  static async setKeyWithExpire (key, value, expireTime) {
    await this.setConnection()
    return this.connection.set(key, value, 'EX', expireTime)
  }

  static async ping () {
    await this.setConnection()
    return this.connection.ping('ping')
  }
}

module.exports = RedisRepository
