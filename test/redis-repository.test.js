const assert = require('assert/strict')

const { RedisConnection, RedisRepository } = require('../index')

describe('Integration tests for RedisRepository', function () {
  let connection = {}
  const keyMock = 'key-integration-test'
  const valueStringMock = 'integration-test'

  before(async function () {
    connection = await RedisConnection.getConnection(process.env.REDIS_URL)
  })

  afterEach(async function () {
    await connection.flushall()
  })

  it('get should return get key', async function () {
    await connection.set(keyMock, valueStringMock)

    const value = await RedisRepository.getKey(keyMock)
    assert.equal(value, valueStringMock)
  })

  it('get should set key', async function () {
    await RedisRepository.setKey(keyMock, valueStringMock)

    const value = await connection.get(keyMock)
    assert.equal(value, valueStringMock)
  })

  it('get should set key with expires', async function () {
    await RedisRepository.setKeyWithExpire(keyMock, valueStringMock, 1)

    let value = await connection.get(keyMock)
    assert.equal(value, valueStringMock)

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(() => resolve(), 1000))

    value = await connection.get(keyMock)
    assert.equal(value, null)
  })

  it('get should return get incr key', async function () {
    const valueMock = '10'

    await connection.set(keyMock, valueMock)

    const value = await RedisRepository.getIncrKey(keyMock)
    assert.equal(value, parseInt(valueMock, 10))
  })

  it('get should return 0 get incr key when doesnt have value', async function () {
    const value = await RedisRepository.getIncrKey(keyMock)
    assert.equal(value, 0)
  })

  it('get should return 0 get incr key when value is string', async function () {
    const valueMock = 'integration-test-10'

    await connection.set(keyMock, valueMock)

    const value = await RedisRepository.getIncrKey(keyMock)
    assert.equal(value, 0)
  })

  it('should increment key', async function () {
    const totalIncrement = 10
    const promises = []

    for (let index = 0; index < totalIncrement; index += 1) {
      promises.push(RedisRepository.incrKey(keyMock))
    }

    await Promise.all(promises)

    const value = await connection.get(keyMock)

    assert.equal(parseInt(value, 10), totalIncrement)
  })

  it('should return ping', async function () {
    await assert.doesNotReject(() => RedisRepository.ping())
  })
})
