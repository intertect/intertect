/**
* Copyright (c) 2018--present, Yash Patel and Peter DeLong
* All rights reserved.
*/

/* eslint-disable-next-line func-names */
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      target: ['Gruntfile.js', '.eslint.js', 'server.js'],
      options: {
        configFile: 'config/eslint.js',
        fix: true,
      },
    },
    bootlint: {
      options: {
        stoponerror: false,
        relaxerror: [],
      },
      files: ['index.html'],
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-bootlint');

  grunt.registerTask('default', ['eslint', 'bootlint']);
  // grunt build is a no-op until we have tasks to perform
  grunt.registerTask('build', () => {});
  grunt.registerTask('test', ['eslint', 'bootlint']);
};
