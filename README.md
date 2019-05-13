# node-redis-retry-strategy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/zsimo/node-redis-retry-strategy.svg?branch=master)](https://travis-ci.org/zsimo/node-redis-retry-strategy)
[![codecov](https://codecov.io/gh/zsimo/node-redis-retry-strategy/branch/master/graph/badge.svg)](https://codecov.io/gh/zsimo/node-redis-retry-strategy)
[![Dependencies](https://david-dm.org/zsimo/node-redis-retry-strategy.svg)](https://david-dm.org/zsimo/node-redis-retry-strategy)
[![install size](https://packagephobia.now.sh/badge?p=node-redis-retry-strategy)](https://packagephobia.now.sh/result?p=node-redis-retry-strategy)

My custom node_redis retry_strategy function

Sometimes, if the Redis server is down, you need to have clients that don't give up and try to reconnect.
