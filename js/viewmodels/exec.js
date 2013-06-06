/**
Description
**/
define(function(require) {
    'use strict';

    var minions = require('models/minions'),
        sysdoc = require('models/sysdoc'),
        xhr = require('utils/xhr'),
        f = require('utils/func'),
        fireEvent = require('utils/events');

    var drawtree = require('elements/exec-results/tree');

    var mixin = require('utils/mixin'),
        withInit = require('./mixins/withInit'),
        withAdvice = require('advice');

    var lunr = require('lunr');

    var specialKeyCodeMap = {
        9: 'tab',
        27: 'esc',
        37: 'left',
        39: 'right',
        13: 'enter',
        38: 'up',
        40: 'down'
    };

    var vm = mixin([withInit, withAdvice], {
        models: [
            f.sendWithCtx(minions, 'get_result'),
            f.sendWithCtx(sysdoc, 'get_result'),
        ],

        hint: '',
        cmd: '',

        inprogress: false,
        result: null,

        show_cmpl: false,

        blah: function(e) {
            var keyName = specialKeyCodeMap[e.which || e.keyCode];

            if (this.cmd === '') this.hint = '';

            switch (keyName) {
                case 'tab':
                    this.cmd = this.hint;
                    this.hint = '';
                    this.show_cmpl = false;
                    break;
                case 'esc':
                    this.show_cmpl = false;
                    break;
                default:
                    if (this.show_cmpl !== true) this.show_cmpl = true;
                    break;
            }

        },

        filter: function() {
            var matches = this.index.search(this.cmd);

            if (matches.length > 0) {
                this.hint = matches[0].ref;
            }

            if (matches.length === 0) {
                return Object.keys(sysdoc._cache.local).sort();
            } else {
                return f.pluckWith('ref')(matches);
            }
        },

        /**
        Return the form fields values as a lowstate data structure
        **/
        lowstate: function() {
            return {
                client: this.client,
                tgt: this.tgt,
                fun: this.fun,
                arg: f.pluckWith('val')(this.arg)
                    .filter(f.compose(f.not, f.isEmpty)),
            };
        },

        /**
        Add items to the ``arg`` array
        **/
        add_arg: function(e) {
            this.arg.push({val:''});
            // TODO: replace this with a for-each-* binding that can reuse
            // existing DOM elements
            fireEvent(e.target, 'x-context-refresh');
        },

        /**
        Send the execution
        **/
        submit: function(e) {
            e.preventDefault();
            var that = this;

            this.inprogress = true;

            this.create_jid()
            .fin(function() {
                that.inprogress = false;
            })
            .done();
        },

        /**
        Submit the execution form via Ajax and fire a custom notification
        with the job ID that is returned for other components to act on.

        @return {Promise}
        **/
        create_jid: function() {
            var that = this;

            this.result = null;

            return xhr('POST', '/minions', [this.lowstate()])
            .get(0).get('return')
            .then(function(result) {
                that.get_results(result.jid);
            });
        },

        /**
        Get the results from a job or retry a number of times if the job has
        not returned any results yet
        **/
        get_results: function(jid) {
            var that = this;
            var get_jid = f.applyLeft(xhr, 'GET', '/jobs/' + jid);

            return f.retry_promise(get_jid, 700, 20)
            .get('return').get(0)
            .then(function (result) {
                that.result = result;
                drawtree.updateTree(result);
            })
            .done();
        },
    });

    /**
    Set up the search indexes
    **/
    vm.around('init', function(init) {
        return init().then(function() {
            vm.index = lunr(function() {
                this.field('name', {boost: 10});
                this.ref('name');
            });

            Object.keys(sysdoc._cache['local']).forEach(function(key) {
                vm.index.add({'name': key, 'id': key});
            });

            return vm;
        });
    });

    return vm;
});
