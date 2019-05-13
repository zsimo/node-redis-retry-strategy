"use strict";

var path = require("path");
var times = require(path.resolve(__dirname, "times"));

module.exports = function init (moduleOptions) {

    if (moduleOptions) {
        if (moduleOptions.hasOwnProperty("number_of_retry_attempts") && !isNaN(moduleOptions.number_of_retry_attempts)) {
            times.NUMBER_OF_RETRY_ATTEMPTS = moduleOptions.number_of_retry_attempts;
        }
        if (moduleOptions.hasOwnProperty("delay_of_retry_attempts") && !isNaN(moduleOptions.delay_of_retry_attempts)) {
            times.DELAY_OF_RETRY_ATTEMPTS = moduleOptions.delay_of_retry_attempts;
        }
        if (moduleOptions.hasOwnProperty("wait_time") && !isNaN(moduleOptions.wait_time)) {
            times.WAIT_TIME = moduleOptions.wait_time;
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

        if (!times.NUMBER_OF_RETRY_ATTEMPTS) {
            // End reconnecting with built in error
            return undefined;
        }

        if (!options.attempt) {
            // if there is no attempt, try again
            return times.DELAY_OF_RETRY_ATTEMPTS;
        }

        if ((options.attempt % (times.NUMBER_OF_RETRY_ATTEMPTS + 1)) === 0) {
            return times.WAIT_TIME;
        } else {
            return times.DELAY_OF_RETRY_ATTEMPTS;
        }
    };

};