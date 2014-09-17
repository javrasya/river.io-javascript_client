// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html


/*jshint indent: false */
/*jshint undef: false */
module.exports = function (config) {
    config.set({
                   // base path, that will be used to resolve files and exclude
                   basePath: '',

                   // testing framework to use (jasmine/mocha/qunit/...)
                   frameworks: ['jasmine'],

                   // list of files / patterns to load in the browser
                   files: [
                       'lib/bower_components/jquery/dist/jquery.js',
                       'lib/bower_components/underscore/underscore-min.js',
                       'scripts/river.io*.js',
                       'test/spec/**/*.js',
                   ],

                   // list of files / patterns to exclude
                   exclude: [],

                   reporters: ['spec'],

                   // web server port
                   port: 8080,

                   // level of logging
                   // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
                   logLevel: config.LOG_INFO,


                   // enable / disable watching file and executing tests whenever any file changes
                   autoWatch: false,


                   // Start these browsers, currently available:
                   // - Chrome
                   // - ChromeCanary
                   // - Firefox
                   // - Opera
                   // - Safari (only Mac)
                   // - PhantomJS
                   // - IE (only Windows)
                   browsers: ['PhantomJS'],


                   // Continuous Integration mode
                   // if true, it capture browsers, run tests and exit
                   singleRun: false
               });
};