/**
Donut charts

@returns A reusable crystal
@example
    d3.select(someElem)
    .datum(someData)
    .call(pie());
**/
define(function(require) {
    'use strict';

    var d3 = require('d3');

    function chart() {
        var width = 50, // default width
            height = 50, // default height
            radius = 30;

        var color = d3.scale.ordinal()
        .range(['green', 'red']);

        // Make a half-circle
        var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - 10)
        // .startAngle(-90 * (Math.PI/180))
        // .endAngle(90 * (Math.PI/180));

        var layout_pie = d3.layout.pie();

        function my(selection) {
            selection.each(function(data) {
                // Make one div per minion
                var div = d3.select(this)
                .selectAll('div')
                .data(d3.entries(data))
                .enter()
                .append('div');

                // Output the minion name
                div
                .append('p')
                .text(function(d){ return d.key; });

                // Make an svg element for each chart (this allows the charts
                // to fill and wrap inside an HTML container element)
                var svg = div
                .selectAll('svg')
                .data(function(d) {
                    if (isNaN(d.value)) return d3.entries(d.value);
                    else return null;
                })
                .enter()
                .append('svg')
                .attr({
                    'width': radius * 2,
                    'height': radius * 2,
                })
                .append('g')
                .attr('transform', 'translate(' + radius + ',' + radius + ')');

                // Output the file system
                svg
                .append('text')
                .text(function(d){ return d.key; });

                // Draw the pie chart
                svg.selectAll('path')
                .data(function(d) {
                    return layout_pie([
                        d.value.total - d.value.available,
                        d.value.available
                    ]);
                })
                .enter()
                .append('path')
                .attr('d', arc)
                .style('fill', function(d) {
                    // console.debug('d2', d);
                    return color(d.data);
                });

                svg
                .exit()
                .remove();
            });
        }

        my.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return my;
        };

        my.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return my;
        };

        return my;
    }

    return chart;
});
