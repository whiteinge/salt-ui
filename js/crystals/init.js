/**
Crystals are visualization modules

Crystals are functions that draw visualizations within a DOM element. They may
be recursive or nested. The default crystal, nested, mimic's Salt's own
"nested" outputter. Some execution results may associate with more specific
crystals.

@module saltui
@submodule crystals
**/
define(function(require) {
    'use strict';

    var crystals = {
        nested:         require('./nested'),
    };

    /**
    Map remote ex functions to supported crystals (in order of preference)
    **/
    var crystals_map = {
        'local.state.highstate': [crystals.highstate],
        'local.grains.items': [crystals.grains],
    };

    /**
    Given a function name returns an array containing the preferred cyrstals
    for that function in order of preference.

    This function should always return at least one crystal, the "nested"
    crystal.

    @param {Object} fun A lowstate dictionary.
        E.g., {client: 'local', fun: 'test.ping'}

    @returns {Array}
    **/
    var get_default = function(fun) {
        var crys = crystals_map[fun] || [];

        // Tree will work for all outputs
        return crys + crystals.nested;
    };

    return get_default;
});
