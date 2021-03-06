'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'index.js',
        'lib/**/*.js',
        'test/**/*.js',
      ],
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',

          // Force colors for the output of mutliTest
          colors: true,
        },
        src: ['test/**/*.js']
      },
    },
  });

  grunt.registerTask('default', [
    'test',
  ]);

  grunt.registerTask('test', [
    'jshint',
    'mochaTest',
  ]);

  // Run the full test suite 100 times. Only print the output when errors are
  // encountered. This is to try to make it easier to track down sporadic test
  // issues that only happen occasionally.
  grunt.registerTask('multiTest', 'Run all the tests multiple times', function() {
    var done = this.async();

    var async = require('async'),
        exec = require('child_process').exec;

    async.timesSeries(100, function(index, next) {
      process.stdout.write('Run ' + index + ' ');
      var progress = setInterval(function() {
        process.stdout.write('.');
      }, 500);

      var startTime = process.hrtime();
      exec('./node_modules/grunt-cli/bin/grunt 2>&1', function(error, stdout) {
        clearInterval(progress);

        var duration = process.hrtime(startTime);
        console.info(' ' + duration[0] + 's');

        if(error !== null) {
          console.info(stdout);
        }

        next();
      });
    }, function() {
      done();
    });
  });
};
