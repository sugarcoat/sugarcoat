/*
 * Autoprefixer
 *
 * See all options: https://github.com/nDmitry/grunt-postcss
 */
module.exports = function( grunt ) {

    grunt.config( 'autoprefixer', {
        options: {
            browsers: [ 'last 2 versions', 'ie 10' ]
        },
        files: {
            expand: true,
            src: '../generators/pattern-library/templates/sugarcoat/css/**/*.css'
        }
    });
    
    grunt.loadNpmTasks( 'grunt-autoprefixer' );
};
