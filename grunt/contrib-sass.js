/*
 * Sass Configuration
 *
 * See all options: https://github.com/gruntjs/grunt-contrib-sass
 */
module.exports = function( grunt ) {

    grunt.config( 'sass', {
        dist: {
            options: {
                sourcemap: 'inline',
                style: 'expanded',
                lineNumbers: true,
                precision: 5
            },
            files: [
                {
                    expand: true,
                    cwd: 'library/styles',
                    src: [
                        '*.scss'
                    ],
                    dest: 'library/css',
                    ext: '.css'
                }
            ],
            rename: function( dest, src ) {

                var path = require( 'path' )
                    , splitDirs = src.split( '/' )
                    ;

                splitDirs[ splitDirs.indexOf( 'scss' ) ] = 'css';

                return path.join( dest, splitDirs.join( '/' ) );
            }
        }
    });
    
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
};
