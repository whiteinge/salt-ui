/**
A reusable module to format return data from a salt command as a tree using d3

Adapted (largely stolen) from http://bl.ocks.org/1093025
**/
define(function(require) {
    'use strict';

    var d3 = require('d3'),
        f = require('utils/func'),
        rentries = require('transforms/rentries');

    // Define any defaults
    var transform = rentries,
        w = 960,
        h = 800,
        i = 0,
        barHeight = 20,
        barWidth = w * 0.8,
        duration = 400;

    var tree = d3.layout.tree()
    .size([h, 100])
    .children(function(d) {
        return typeof(d.value) === 'object' ? d.value : null;
    });

    var diagonal = d3.svg.diagonal()
    .projection(function(d) {
        return [d.y, d.x];
    });

    function fmt_label(d) {
        return d.key;
    }

    /**
    Do any required setup and data transformation
    **/
    function chart(sel) {

        sel.each(function(raw_data) {
            var main = d3.select(this),
                data = {
                    key: 'return',
                    value: transform(raw_data),
                    x0: 0,
                    y0: 0,
                };

            main
            .datum(data)
            .append('svg')
            .attr({
                'width': w,
                'height': h,
            })
            .append('g')
            .attr('transform', 'translate(20,30)')
            .call(update)
            ;
        });

    }

    chart.transform = f.fluent(function(val) {
        if (!arguments.length) return transform;
        transform = val;
    });

    chart.fmt_label = f.fluent(function(val) {
        if (!arguments.length) return fmt_label;
        fmt_label = val;
    });

    /**
    Do all the real work & write to the DOM
    **/
    function update(sel) {
        sel.each(function(data) {

            // Call initially with data for root node
            update_source(data);

            /**
            Draw the tree to the DOM using source coordinates for the clicked
            element or the root element
            **/
            function update_source(source) {
                // Compute the flattened node list
                var nodes = tree.nodes(data);

                // Compute the "layout".
                nodes.forEach(function(n, i) {
                    n.x = i * barHeight;
                });

                // Update the nodes…
                var node = sel
                .selectAll('g.node')
                .data(nodes, function(d) { return d.id || (i += 1, d.id = i) });

                var nodeEnter = node
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('transform', function(d) {
                    return 'translate(' + source.y0 + ',' + source.x0 + ')';
                })
                .style('opacity', 1e-6);

                // Enter any new nodes at the parent's previous position.
                nodeEnter
                .append('rect')
                .attr('y', -barHeight / 2)
                .attr('height', barHeight)
                .attr('width', barWidth)
                .attr('rx', 5)
                .attr('ry', 5)
                .style('fill', color)
                .on('click', click);

                var label = nodeEnter
                .append('text')
                .attr('dy', 3.5)
                .attr('dx', 5.5);

                label
                .append('tspan')
                .attr('class', 'name')
                .text(fmt_label);

                label
                .append('tspan')
                .text(function(d) {
                    return typeof(d.value) === 'object' ? null : ': ';
                });

                label
                .append('tspan')
                .attr('class', 'value')
                .text(function(d) {
                    return typeof(d.value) === 'object' ? null : d.value;
                });

                // Transition nodes to their new position.
                nodeEnter.transition()
                .duration(duration)
                .attr('transform', function(d) {
                    return 'translate(' + d.y + ',' + d.x + ')';
                })
                .style('opacity', 1);

                node
                .transition()
                .duration(duration)
                .attr('transform', function(d) {
                    return 'translate(' + d.y + ',' + d.x + ')';
                })
                .style('opacity', 1)
                .select('rect')
                .style('fill', color);

                // Transition exiting nodes to the parent's new position.
                node
                .exit()
                .transition()
                .duration(duration)
                .attr('transform', function(d) {
                    return 'translate(' + source.y + ',' + source.x + ')';
                })
                .style('opacity', 1e-6)
                .remove();

                // Update the links…
                var link = sel
                .selectAll('path.link')
                .data(tree.links(nodes), function(d) { return d.target.id });

                // Enter any new links at the parent's previous position.
                link
                .enter()
                .insert('path', 'g')
                .attr('class', 'link')
                .attr('d', function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                })
                .transition()
                .duration(duration)
                .attr('d', diagonal);

                // Transition links to their new position.
                link
                .transition()
                .duration(duration)
                .attr('d', diagonal);

                // Transition exiting nodes to the parent's new position.
                link
                .exit()
                .transition()
                .duration(duration)
                .attr('d', function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

            }

            // Toggle children on click.
            function click(d) {
                console.debug('d', d);

                // Short-circuit for values without children values
                if (typeof(d.value) !== 'object') return;

                if (d.value) {
                    d._value = d.value, d.value = null;
                    d._children = d.children, d.children = null;
                } else {
                    d.value = d._value, d._value = null;
                    d.children = d._children, d._children = null;
                }
                update_source(d);
            }

            function color(d) {
                // Short-circuit for values without children values
                if (typeof(d.value) !== 'object') return '#fd8d3c';

                if (d._value) return '#3182bd';
                if (d.value) return '#c6dbef';
                return '#fd8d3c';
            }

        });
    }

    return chart;
});
