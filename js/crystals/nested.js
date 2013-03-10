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
    function color_types(d) {
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

    // Sugar
    var has = Object.hasOwnProperty;

    function chart(sel) {
        sel.each(function(data) {

            var main = d3.select(this)
            .append('ul');

            var item = main
            .selectAll('li')
            .data(data);

            item
            .enter()
            .append('li')
            ;

            var nochild = item
            .filter(function(d) { return !has.call(d, 'children') })
            ;

            nochild
            .append('span')
            .text(function(d) { return d.key })
            ;

            nochild
            .append('span')
            .attr('class', color_types)
            .text(function(d) { return d.value })
            ;

            item
            .filter(function(d) { return has.call(d, 'children') })
            .text(function(d) { return d.key })
            .datum(function(d) { return d.children })
            .call(chart)
            ;

            item
            .exit()
            .remove()
            ;

        });
    }

    return chart;
});
