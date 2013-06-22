/**
Bar charts

@author Tor Hveem @torhve

@returns A reusable crystal
@example
    d3.select(someElem)
    .datum(someData)
    .call(bar());
**/
define(function(require) {
    'use strict';

    var d3 = require('d3');

    function chart() {

        /* Init defaults */
        var width = 800,
            bar_height = 15,
            rx = 3,
            ry = 3,
            x,
            y,
            left_width = 120,
            gap = 2,
            keys,
            keyfmt,
            valfmt;

        function my(selection) {
            selection.each(function(data) {

                /* Append SVG object */
                var chart = d3.select(this)
                .append('svg')
                .attr('class', 'chart')
                .attr('width', left_width + width + 40)
                .attr('height', (bar_height + gap * 2) * keys.length + 30)
                .append("g")
                .attr("transform", "translate(10, 20)");

                x = d3.scale.linear()
                .domain([0, d3.max(data)])
                .range([0, width]);

                y = d3.scale.ordinal()
                .domain(data)
                .rangeBands([0, (bar_height + 2 * gap) * keys.length]);

                chart.selectAll("rect")
                .data(data)
                .enter().append("rect")
                .attr("x", left_width)
                .attr("y", function(d) { return y(d) + gap; })
                .attr("ry", rx)
                .attr("xy", ry)
                .attr("width", x)
                .attr("height", bar_height);

                chart.selectAll(".rule")
                .data(x.ticks(d3.max(keys)))
                .enter().append("text")
                .attr("class", "rule")
                .attr("x", function(d) { return x(d) + left_width; })
                .attr("y", 0)
                .attr("dy", -6)
                .attr("text-anchor", "middle")
                .attr("font-size", 10)
                .text(String);

                chart.selectAll("text.score")
                .data(data)
                .enter().append("text")
                .attr("x", function(d) { return x(d) + left_width; })
                .attr("y", function(d, i){ return y(d) + y.rangeBand()/2; } )
                .attr("dx", -5)
                .attr("dy", ".36em")
                .attr("text-anchor", "end")
                .attr('class', 'score')
                .text(valfmt);

                chart.selectAll("text.name")
                .data(keys)
                .enter().append("text")
                .attr("x", left_width / 2)
                .attr("y", function(d, i){ return y(d) + y.rangeBand()/2; } )
                .attr("dy", ".36em")
                .attr("text-anchor", "middle")
                .attr('class', 'name')
                .text(keyfmt);


                chart.selectAll("rect")
                .data(data)
                .enter().append("rect")
                .attr("x", left_width)
                .attr("y", function(d) { return y(d) + gap; })
                .attr("width", x)
                .attr("height", bar_height);
            });
        }

        my.keys = function(val) {
            if (!arguments.length) return keys;
            keys = val;
            return my;
        };

        my.values = function(val) {
            if (!arguments.length) return values;
            values = val;
            return my;
        };

        my.keyfmt = function(val) {
            if (!arguments.length) return keyfmt;
            keyfmt = val;
            return my;
        };

        my.valfmt = function(val) {
            if (!arguments.length) return valfmt;
            valfmt = val;
            return my;
        };

        return my;
    }

    return chart;
});
