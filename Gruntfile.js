module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['src/omega'],
            options: {
                jshintrc: ".jshintrc",
                reporter: require('jshint-summary')
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },

        clean: ["dist"],

        requirejs: {
            options: {
                preserveLicenseComments: false,
                optimize: "none"
            },

            omega: {
                options: {
                    baseUrl: "src",
                    mainConfigFile: 'src/omega/config.release.js',
                    include: ["omega/main"],
                    exclude: ["jquery", "text"],
                    out: "dist/js/omega.js"
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    "dist/css/omega.min.css": "css/omega.css",
                    "dist/css/jquery-ui-1.10.0.custom.min.css": "css/jquery-ui-1.10.0.custom.css"
                }
            }
        },

        copy: {
            dist: {
                files: [
                    { expand: true, src: ["images/*"], dest: "dist/" },
                    { expand: true, src: ["LICENSE.md", "README.md" ], dest: "dist/" },
                    { expand: true, src: ['bower_components/jquery/jquery.min.js'], dest: "dist/" }
                ]
            }
        },


    });

    // Default task(s).
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('dist', ['clean', 'requirejs', 'cssmin:dist', 'copy']);

};