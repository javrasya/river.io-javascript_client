// Generated on 2014-05-08 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        river: {
            // configurable paths
            io: {
                app: '/',
                dist: 'dist'
            }


        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= river.io.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= river.io.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= river.io.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= river.io.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= river.io.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= river.io.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= river.io.app %>/scripts/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: false,
                        src: [
                            '.tmp',
                            '<%= river.io.dist %>/*',
                            '!<%= river.io.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= river.io.app %>/index.html'],
                ignorePath: '<%= river.io.app %>/'
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= river.io.dist %>/scripts/{,*/}*.js',
                        '<%= river.io.dist %>/styles/{,*/}*.css'
                    ]
                }
            }
        },


        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= river.io.dist %>/{,*/}*.html'],
            css: ['<%= river.io.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= river.io.dist %>']
            }
        },


        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= river.io.app %>/images',
                        src: '{,*/}{,*/}{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= river.io.dist %>/images'
                    }
                ]
            }
        },

        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= river.io.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= river.io.dist %>/images'
                    }
                ]
            }
        },


        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= river.io.app %>',
                        dest: '<%= river.io.dist %>',
                        src: [
                            '*.{ico,png,txt,xml}',
                            '.htaccess',
                            'CNAME',
                            '*.html',
                            'views/**/*.html',
                            'images/{,*/}{,*/}{,*/}*.{webp}',
                            'fonts/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= river.io.dist %>/images',
                        src: ['generated/*']
                    },
                    {
                        expand: true,
                        cwd: '<%= river.io.app %>/bower_components/bootswatch-dist/fonts',
                        src: ['*'],
                        dest: '<%= river.io.dist %>/fonts'
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= river.io.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
            ],
            test: [
            ],
            dist: [
                'svgmin'
            ]
        },


        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false,
                title: 'Egemsoft.net Documentation'
            },
            all: ['app/scripts/**/*.js']
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bowerInstall',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'bowerInstall',
        'concurrent:dist',
        'autoprefixer',
        'copy:dist',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};