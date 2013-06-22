/**
The master config values

@module saltui.models
@submmodule config
**/
define(function(require) {
    'use strict';

    var withCachedSync = require('./mixins/withCachedSync');

    function Config() {
        this.lowstate = [{client: 'wheel', fun: 'config.values'}];

        this.update = function(result) {
            return result['return'][0];
        };
    }

    /**
    Apply mixins
    **/
    withCachedSync.call(Config.prototype);

    return new Config();
});
