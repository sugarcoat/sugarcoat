/*
 * Autoprefixer
 *
 * See all options: https://github.com/nDmitry/grunt-postcss
 */
module.exports = function( grunt ) {

    grunt.config( 'postcss', {
        options: {
            map: true,
            processors: [
                require( 'postcss-import' )(),
                require( 'postcss-url' )(),
                require( 'postcss-comment/hookRequire')(),
                require( 'postcss-cssnext' )(),
                // more plugins here.
                // require('autoprefixer')({browsers: ['last 2 versions']}),
                require( 'postcss-browser-reporter' )(),
                require( 'postcss-reporter' )()
            ]
        },
        dist: {
            src: 'library/styles/index.css',
            dest: 'library/dist/index.css'
        }
    });
    
    grunt.loadNpmTasks( 'grunt-postcss' );
};
