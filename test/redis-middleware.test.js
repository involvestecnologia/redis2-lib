const assert = require('assert').strict
const chai = require('chai')
const chaiHttp = require('chai-http')
const express = require('express')

const { RedisMiddleware } = require('../index')

chai.use(chaiHttp)

describe('Integration tests of RedisMiddleware', function () {
  it('should inject integrations.redis at the request', async function () {
    const app = express()
    app.use(RedisMiddleware.setRedisIntegration)
    const route = '/'
    app.get(route, async (req, res) => {
      await req.integrations.redis.set('foo', 'bar')
      const resp = await req.integrations.redis.get('foo')
      assert.equal(resp, 'bar')
      res.sendStatus(200)
    })

    await chai.request(app).get(route)
  })
})
