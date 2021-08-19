'use_strict'

const assert = require('assert').strict

const { RedisConnection } = require('../index')

describe('Integration tests for RedisConnection', function () {
  afterEach(async function () {
    await RedisConnection.closeConnection()
  })

  it('should connect properly', async function () {
    assert.doesNotReject(await RedisConnection.getConnection(process.env.REDIS_URL))
  })

  it('should use the same connection object', async function () {
    const connection = await RedisConnection.getConnection(process.env.REDIS_URL)
    const connection2 = await RedisConnection.getConnection(process.env.REDIS_URL)

    assert.equal(connection, connection2)
  })

  it('should not raise error if close is called multiple times', async function () {
    await RedisConnection.getConnection(process.env.REDIS_URL)
    await RedisConnection.closeConnection()
    await RedisConnection.closeConnection()
  })
})
