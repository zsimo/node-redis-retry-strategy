# node-redis-retry-strategy

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/zsimo/node-redis-retry-strategy.svg?branch=master)](https://travis-ci.org/zsimo/node-redis-retry-strategy)
[![codecov](https://codecov.io/gh/zsimo/node-redis-retry-strategy/branch/master/graph/badge.svg)](https://codecov.io/gh/zsimo/node-redis-retry-strategy)
[![Dependencies](https://david-dm.org/zsimo/node-redis-retry-strategy.svg)](https://david-dm.org/zsimo/node-redis-retry-strategy)
[![install size](https://packagephobia.now.sh/badge?p=node-redis-retry-strategy)](https://packagephobia.now.sh/result?p=node-redis-retry-strategy)

A custom implementation of the [node_redis](https://github.com/NodeRedis/node_redis) retry_strategy function.

Sometimes, if the Redis server is down, you need to have clients that don't give up and try to reconnect.  
"node-redis-retry-strategy" is a function that returns the [node_redis](https://github.com/NodeRedis/node_redis) `retry_strategy` function.
The strategy is: every `wait_time` try to connect for `number_of_retry_attempts` times (each time separated by `delay_of_retry_attempts`).
By default, every 5 minutes, try 5 times to reconnect (every attempt is separated by 500 ms). It retries `forever`.
 
`* 2.0 breaking change`: by default do not allow to start the service without a redis connection; to have the previous behaviour set `allow_to_start_without_connection`:`true`

## Install
```bash
# with npm
npm install node-redis-retry-strategy

# or with yarn
yarn add node-redis-retry-strategy
```

## Usage
```js
// redisClient.js file
var redis = require("redis");
var retryStrategy = require("node-redis-retry-strategy");

var client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    retry_strategy: retryStrategy()
});

module.exports = client;
```
```js
// index.js file
var redisClient = require("redisClient.js");

redisClient.on("connect", function () {
    console.log("connected!");
});
redisClient.on("end", function () {
    console.log("redis connection has closed");
});
redisClient.on("reconnecting", function (o) {
    console.log("redis client reconnecting", o.attempt, o.delay);
});
```
## Options
It accepts options object as a parameter with 4 possible keys:
#### allow_to_start_without_connection `type boolean`
Default: `false`
2 possible scenarios: 
- `false` if there is no connection when the service starts, end reconnecting throwing an error and flush all commands
- `true` allow to start the service without a redis connection
```js
var redis = require("redis");
var retryStrategy = require("node-redis-retry-strategy");

var client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    retry_strategy: retryStrategy({
        allow_to_start_without_connection: true
    })
});

module.exports = client;
```
#### number_of_retry_attempts `type number` ms
Default: `5`  
The number of attempts separated by the `delay_of_retry_attempts`. If set to 0, it ends reconnecting with the built in error.
```js
var redis = require("redis");
var retryStrategy = require("node-redis-retry-strategy");

var client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    retry_strategy: retryStrategy({
        number_of_retry_attempts: 7
    })
});

module.exports = client;
```
#### delay_of_retry_attempts `type number` ms
Default: `500`  
The delay between each retry attempts.
```js
var redis = require("redis");
var retryStrategy = require("node-redis-retry-strategy");

var client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    retry_strategy: retryStrategy({
        delay_of_retry_attempts: 1000
    })
});

module.exports = client;
```
#### wait_time `type number` ms
Default: `300000` (5 min)  
How long stop retrying to connect.
```js
var redis = require("redis");
var retryStrategy = require("node-redis-retry-strategy");

var client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    retry_strategy: retryStrategy({
        wait_time: 600000
    })
});

module.exports = client;
```

## License
[MIT](https://github.com/zsimo/env-to-config/blob/master/LICENSE)