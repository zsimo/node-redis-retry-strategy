"use strict";

var path = require("path");
var defaults = require(path.resolve(__dirname, "defaults"));
var retryStrategy = require(path.resolve(__dirname, "index"));

describe("node-redis-retry-strategy", () => {

    test("If there is no attempts, wait for DELAY_OF_RETRY_ATTEMPTS", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 0
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });
    test("first attempt, wait for DELAY_OF_RETRY_ATTEMPTS", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 1
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });
    test("second attempt, wait for DELAY_OF_RETRY_ATTEMPTS", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 2
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });
    test("third attempt, wait for DELAY_OF_RETRY_ATTEMPTS", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 3
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });
    test("fourth attempt, wait for DELAY_OF_RETRY_ATTEMPTS", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 4
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });
    test("fifth attempt, wait for DELAY_OF_RETRY_ATTEMPTS", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 5
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });
    test("after the fifth, wait for WAIT_TIME", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 6
        })).toEqual(defaults.WAIT_TIME);
    });
    test("after the sixth, wait for WAIT_TIME", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 7
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });
    test("after the eleventh, wait for WAIT_TIME", () => {
        var strategy = retryStrategy();
        expect(strategy({
            attempt: 12
        })).toEqual(defaults.WAIT_TIME);
    });

    test("if number_of_retry_attempts is 0, end reconnecting with built in error", () => {
        var strategy = retryStrategy({
            number_of_retry_attempts: 0
        });
        expect(strategy({
            attempt: 12
        })).toEqual(undefined);
    });

    test("change delay_of_retry_attempts", () => {
        var strategy = retryStrategy({
            delay_of_retry_attempts: 600,
            number_of_retry_attempts: 5
        });
        expect(strategy({
            attempt: 3
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });

    test("change wait_time", () => {
        var strategy = retryStrategy({
            delay_of_retry_attempts: 500,
            number_of_retry_attempts: 5,
            wait_time: 1000
        });
        expect(strategy({
            attempt: 12
        })).toEqual(defaults.WAIT_TIME);
    });

    test("redis server does not exits", () => {
        var strategy = retryStrategy();
        var result = strategy({
            error: {
                code: "ECONNREFUSED"
            }
        });
        expect(result.name).toEqual("Error");
        expect(result.message).toEqual("The server refused the connection");
    });
    test("do not check if redis exists at startup", () => {
        var strategy = retryStrategy({
            allow_to_start_without_connection: true
        });
        expect(strategy({
            attempt: 0
        })).toEqual(defaults.DELAY_OF_RETRY_ATTEMPTS);
    });

});
