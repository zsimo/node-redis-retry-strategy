"use strict";

var defaults = require("./defaults");


module.exports = function init (moduleOptions) {

    var redisExists = false;

    if (moduleOptions) {
        if (moduleOptions.hasOwnProperty("number_of_retry_attempts") && !isNaN(moduleOptions.number_of_retry_attempts)) {
            defaults.NUMBER_OF_RETRY_ATTEMPTS = moduleOptions.number_of_retry_attempts;
        }
        if (moduleOptions.hasOwnProperty("delay_of_retry_attempts") && !isNaN(moduleOptions.delay_of_retry_attempts)) {
            defaults.DELAY_OF_RETRY_ATTEMPTS = moduleOptions.delay_of_retry_attempts;
        }
        if (moduleOptions.hasOwnProperty("wait_time") && !isNaN(moduleOptions.wait_time)) {
            defaults.WAIT_TIME = moduleOptions.wait_time;
        }
        if (moduleOptions.hasOwnProperty("allow_to_start_without_connection") && typeof moduleOptions.allow_to_start_without_connection === "boolean") {
            defaults.ALLOW_TO_START_WITHOUT_CONNECTION = moduleOptions.allow_to_start_without_connection;
        }
    }

    /**
     * In case of Redis down, every WAIT_TIME try to connect for NUMBER_OF_RETRY_ATTEMPTS
     * times (each time separated by DELAY_OF_RETRY_ATTEMPTS).
     * It will try to connect to redis forever.
     *
     * @example every 5 min, try for 5 times
     *
     * @author Simone Sacchi
     * @version 2019/05/08
     */
    return function retryStrategy (options) {

        if (!redisExists && !defaults.ALLOW_TO_START_WITHOUT_CONNECTION && options.error && options.error.code === "ECONNREFUSED") {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error("The server refused the connection");
        }

        redisExists = true;

        if (!defaults.NUMBER_OF_RETRY_ATTEMPTS) {
            // End reconnecting with built in error
            return undefined;
        }

        if (!options.attempt) {
            // if there is no attempt, try again
            return defaults.DELAY_OF_RETRY_ATTEMPTS;
        }

        if ((options.attempt % (defaults.NUMBER_OF_RETRY_ATTEMPTS + 1)) === 0) {
            return defaults.WAIT_TIME;
        } else {
            return defaults.DELAY_OF_RETRY_ATTEMPTS;
        }
    };

};