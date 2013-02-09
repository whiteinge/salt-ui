module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        // Move .js files from bower-installed libs into common dir
        bower: {
            dir: 'components',
            dev: {
                dest: 'lib',
            },
        },

        // specifying JSHint options and globals
        jshint: {
            all: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
            options: {
                // Enforcing options
                "bitwise": true,
                "eqeqeq": true,
                "forin": true,
                "immed": true,
                "maxcomplexity": 4,
                "maxdepth": 3,
                "maxlen": 80,
                "newcap": true,
                "noarg": true,
                "plusplus": true,
                "regexp": true,
                "trailing": true,
                "undef": true,
                "unused": true,

                // Relaxing options
                "lastsemic": true,

                // Environment options
                "browser": true,
                "es5": true,

                "predef": [
                    "define",
                    "requirejs",
                ],
            },
        },

        // RequireJS config
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'js/saltui.js',
                    baseUrl: 'lib',

                    optimize: 'uglify',
                    generateSourceMaps: false,
                    inlineText: true,
                    useStrict: false,
                    preserveLicenseComments: false,
                    logLevel: 0, // 2

                    uglify: {
                        toplevel: false, // needed to not break shims
                        ascii_only: true,
                        // max_line_length: 1000,
                    },

                    name: '../js/saltui',
                    out: 'lib/saltui.min.js',
                },
            },
        },

        // Generate a dependency graph using d3
        dependencygraph: {
            targetPath: 'js',
            outputPath: '/tmp/salt-ui_graph',
            format: 'amd',
        },
    });

    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-dependencygraph');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Alias the `test` task to run the `mocha` task instead
    // grunt.registerTask('test', 'server:phantom mocha');
};
