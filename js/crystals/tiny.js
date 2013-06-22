/**
The smallest possible reusable crystal with override-able defaults and basic
separation of concerns.
**/
define(function(require) {
    'use strict';

    var d3 = require('d3');

    function chart(sel, width, height) {
        sel.each(function(data) {
            var main = sel;

            main
            .selectAll('p')
            .data(data)
            .enter()
            .append('p')
            .text(function(d) { return d.key })
            ;

        });
    }

    return chart;
});
