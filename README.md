# @involves/redis2-lib

[![Build status](https://badge.buildkite.com/edb6f11956b74d84e6e48b671e5df36688b1c682aaeed0c452.svg)](https://buildkite.com/involves/nodejs-lib-redis2)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=involvestecnologia_redis2-lib&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=involvestecnologia_redis2-lib)
## Install
```
npm install @involves/redis-lib2 --save
```

## Example usage

```javascript
    const express = require('express')
    const { RedisMiddleware } = require('@involves/redis2-lib')

    const app = express()
    app.use(RedisMiddleware.setRedisIntegration)
    app.get('/:id', (req, res) => {
        const record = await req.integrations.redis.get(req.query.id)
        res.send(record)
    })
```

## How to run the tests

At the terminal, just type the command:
```
make test
```
