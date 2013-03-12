/**
Description
**/
define(function(require) {
    'use strict';

    function logError(message, inDevmode) {
        if (inDevmode) console.error(message);
    }

    function makeLogger(inDevmode) {
        return function (err) {
            return logError(err.message || err.toString(), inDevmode);
        };
    }

    return makeLogger;
});
