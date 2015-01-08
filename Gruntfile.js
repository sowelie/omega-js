module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['src/omega'],
            options: {
                jshintrc: ".jshintrc",
                reporter: require('jshint-summary')
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['jshint']);

};