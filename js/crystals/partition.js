/**
Description
http://mbostock.github.com/d3/talk/20111018/partition.html
**/
define(function(require) {
    'use strict';

    var d3 = require('d3'),
        rentries = require('transforms/rentries');

    function chart() {
        var w = 1120,
            h = 600,
            x = d3.scale.linear().range([0, w]),
            y = d3.scale.linear().range([0, h]),
            transform = rentries;

        function my(selection) {
            selection.each(function(raw_data) {
                var main = d3.select(this),
                    data = transform(raw_data),
                    root = data;

                var vis = main
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h);

                var partition = d3.layout.partition()
                .value(function(d) { return d.value });

                var g = vis.selectAll("g")
                .data(partition.nodes(root))
                .enter().append("svg:g")
                .attr("transform", function(d) {
                    return "translate(" + x(d.y) + "," + y(d.x) + ")";
                })
                .on("click", click);

                var kx = w / root.dx,
                    ky = h / 1;

                g.append("svg:rect")
                .attr("width", root.dy * kx)
                .attr("height", function(d) { return d.dx * ky; })
                .attr("class", function(d) {
                    return d.value.length ? "parent" : "child";
                });

                g.append("svg:text")
                .attr("transform", itransform)
                .attr("dy", ".35em")
                .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0 })
                .text(function(d) { return d.key });

                d3.select(window)
                .on("click", function() { click(root) });

                function click(d) {
                    if (!d.value.length) return;

                    kx = (d.y ? w - 40 : w) / (1 - d.y);
                    ky = h / d.dx;
                    x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
                    y.domain([d.x, d.x + d.dx]);

                    var t = g.transition()
                        .duration(d3.event.altKey ? 7500 : 750)
                        .attr("transform", function(d) {
                            return "translate(" + x(d.y) + "," + y(d.x) + ")";
                        });

                    t.select("rect")
                    .attr("width", d.dy * kx)
                    .attr("height", function(d) { return d.dx * ky; });

                    t.select("text")
                    .attr("transform", itransform)
                    .style("opacity", function(d) {
                        return d.dx * ky > 12 ? 1 : 0;
                    });

                    d3.event.stopPropagation();
                }

                function itransform(d) {
                    return "translate(8," + d.dx * ky / 2 + ")";
                }



            });
        }

        my.transform = function(val) {
            if (!arguments.length) return transform;
            transform = val;
            return my;
        };

        return my;
    }

    return chart;
});
