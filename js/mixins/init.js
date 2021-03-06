/**
A collection point to register custom X-Tag mixins
**/
define(function(require) {
    'use strict';

    var xtag = require('x-tag');
    var mixins = {
        datamodel:      require('mixins/datamodel'),
    };

    // Register with X-Tag
    Object.keys(mixins).forEach(function(val) {
        xtag.mixins[val] = mixins[val];
    });

    return mixins;
});

