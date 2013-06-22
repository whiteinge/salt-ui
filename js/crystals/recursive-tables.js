/**
A reimplementation of Salt's (default) nested outputter

@module saltui.crystals
@submodule nested
**/
define(function(require) {
    'use strict';

    var d3 = require('d3'),
        f = require('utils/func'),
        underpipedash = require('crystals/utils/underpipedash');

    /**
    Execute a function; if the return is the same as the input then return it,
    otherwise process that return through another function
    **/
    // FIXME: deconstruct; this is doing two separate things
    var fmtupd = f.variadic(function(func, args) {
        var ret = func.apply(this, args);
        if (ret === args[0]) return ret;

        return '{id}: {mod}.{fun}'.supplant(ret);
    });

    /**
    Return a class name for types in highstate output such as changes dicts,
    booleans, strings, etc.
    **/
    function color(d) {
        switch (Object.prototype.toString.call(d)) {
            case '[object Boolean]':
            case '[object Number]':
            case '[object Null]':
                return 'yellow';
            case '[object String]':
                return 'green';
            case '[object Array]':
                break;
            case '[object Object]':
                break;
        }
    }

    /**
    Return a human-friendly version of the highstate return key
    **/
    var format_name = f.wrap(underpipedash, fmtupd);

    /**
    Draw a return as nested tables
    **/
    function chart(sel) {
        sel.each(function(data) {

            var table = d3.select(this);

            /*jshint expr:true */
            var colnames = data
            .reduce(function(p, c) { return p.concat(d3.keys(c)) }, [])
            .reduce(function(p, c) { return p.set(c, 0), p }, d3.map())
            .keys()
            ;

            table
            .append('thead')
            .append('tr')
            .selectAll('th')
            .data(colnames)
            .enter()
            .append('th')
            .text(f.identity)
            ;

            var tds = table
            .append('tbody')
            .selectAll('tr')
            .data(data)
            .enter()
            .append('tr')
            .selectAll('td')
            .data(function(d) {
                return colnames.map(function(k) {
                    return d[k] || '';
                });
            })
            .enter()
            .append('td')
            .style('vertical-align', 'top')
            ;

            tds
            .filter(function(d) { return typeof(d) !== 'object'; })
            .text(format_name)
            ;

            tds
            .filter(function(d) { return (typeof(d) === 'object'); })
            .append('table')
            .call(chart)
            ;

        });
    }

    return chart;
});
