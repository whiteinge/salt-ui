================
Writing crystals
================

Towards Reusable Charts: http://bost.ocks.org/mike/chart/
General Update Pattern: http://bl.ocks.org/3808218

::

    /**
    Description
    **/
    define(function(require) {
        'use strict';

        var d3 = require('d3');

        function chart() {
            var default_stuffs;

            function my(selection) {
                selection.each(function nested(data) {

                    // Select main element
                    var main = d3.select(this);

                    // DATA JOIN (join new data with old elems)
                    var li = main
                    .selectAll('li')
                    .data(tmp)
                    ;

                    // UPDATE (old elems)
                    // .attr()

                    // ENTER (create new elems)
                    li
                    .enter()
                    .append('li')
                    ;

                    // ENTER + UPDATE (update both entering and updating elems)
                    // .text(function(d){ return d; })

                    // EXIT (remove old elems)
                    li
                    .exit()
                    .remove()
                    ;

                });
            }

            my.default_stuffs = function(val) {
                if (!arguments.length) return default_stuffs;
                default_stuffs = val;
                return my;
            };

            return my;
        }

        return chart;
    });

Call the above thusly::

    d3.select(someElem)
    .datum(someData)
    .call(
        theChart().{efault_stuffs(function(){ return 'new stuff'; })
    );
