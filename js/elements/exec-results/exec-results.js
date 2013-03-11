/**
A custom element to execute Salt modules via salt-api

@module saltui.elements
@submmodule exec-results
**/
define(function(require) {
    'use strict';

    var template = require('text!./template.html'),
        drawtree = require('./tree');

    var el = {
        'lifecycle': {
            created: function(){
                this.innerHTML = template;
                var chart = require('crystals/nested'),
                    rentries = require('crystals/utils/rentries');


                // Success!
                //
                // 1. make a version of send() that preserves context
                // 2. partially apply sel and datum to send()
                // 3. compose the partial

                /**
                Return a function that draws a crystal to the DOM

                @return {Function}
                **/
                function get_draw(elem, data) {
                    var sel = d3.select(elem),
                        datum = f.applyLeft(f.sendWithCtx, sel, 'datum');

                    var draw = f.compose(chart, datum, rentries);
                    return f.applyFirst(draw, data);
                }

                var draw = get_draw(this, result);
                draw();
            },
        },
    };

    return el;
});
