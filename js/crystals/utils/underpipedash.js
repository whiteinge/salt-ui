/**
Transform a lowstate string with _|- delimeters into an object
**/
define(function() {
    'use strict';

    function underpipedash(val) {
        if (typeof(val) !== 'string') return val;

        var arr;

        if (val.contains('_|-')) {
            arr = val.split('_|-');

            return {
                state: arr[0],
                id: arr[1],
                name: arr[2],
                fun: arr[3],
            };
        }

        return val;
    }

    return underpipedash;
});
