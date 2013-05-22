/**
Description
**/
define(function(require) {
    'use strict';

    var xhr = require('utils/xhr'),
        fireEvent = require('utils/events');

    var mixin = require('utils/mixin'),
        withInit = require('./mixins/withInit'),
        withAdvice = require('advice');

    var vm = mixin([withInit, withAdvice], {
        username: '',
        password: '',
        eauth: 'pam',

        inprogress: false,
        errormsg: '',

        submit: function(e, model, view) {
            e.preventDefault();

            var that = model;

            that.inprogress = true;
            that.errormsg = '';

            console.debug('this', that, arguments);

            xhr('POST', '/login', {
                username: that.username,
                password: that.password,
                eauth: that.eauth})
            .then(
                function(result) {
                    that.username = '';
                    that.password = '';
                    fireEvent(e.target, 'x-login-authed', result);
                    window.history.back();
                },
                function (result) {
                    that.errormsg = result;
                }
            ).fin(function() {
                that.inprogress = false;
            }).done();
        },
    });

    return vm;
});
