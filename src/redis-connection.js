'use_strict'

const Redis = require('ioredis')

class RedisConnection {
/**
   * Connects to Redis
   * @param {string} host - IP or name to establish connection. Example {redis-pod-name}
   * @param {string} port - listening port
   * @param {string} password - password to login
   * @param {int} db - index of db
   */
  static async getConnection (host, port, password, db) {
    this.connection = await _connect(this.connection, host, port, password, db)
    return this.connection
  }

  /**
   * Closes the connections
   */
  static async closeConnection () {
    if (this.connection) {
      await this.connection.quit()
      this.connection = undefined
    }
  }
}

const _connect = async (connection, host = '127.0.0.1', port = '6379', password = '', db = 0) => {
  if (connection) return connection

  connection = new Redis({
    host: host,
    port: port,
    password: password,
    db: db,
    connectTimeout: 17000,
    maxRetriesPerRequest: 4,
    retryStrategy: (times) => Math.min(times * 30, 1000),
    reconnectOnError: (error) => {
      const targetErrors = [/READONLY/, /ETIMEDOUT/]

      targetErrors.forEach((targetError) => {
        if (targetError.test(error.message)) {
          return true
        }
      })
    }
  })

  await connection.ping('ping')
  return connection
}

module.exports = RedisConnection
