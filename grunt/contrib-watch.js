/*
 * Watch Configuration
 *
 * See all options: https://github.com/gruntjs/grunt-contrib-watch
 */
module.exports = function( grunt ) {

    grunt.config( 'watch', {
        sass: {
            files: [ 'styles/*.scss' ],
            tasks: [ 'sassdev' ]
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-watch' );
};