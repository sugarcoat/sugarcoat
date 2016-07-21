/*
 * See all options: https://github.com/nDmitry/grunt-postcss
 */
module.exports = function( grunt ) {

    grunt.config( 'postcss', {
        foo: {
            options: {
                map: true,
                processors: [
                    require( 'postcss-import' )(),
                    require( 'postcss-url' )(),

                    // pops placeholders to top of css
                    require( 'postcss-sass-extend' )(),

                    // enables nesting, variables, autoprefixer
                    require( 'postcss-cssnext' )(),

                    // more plugins here.

                    require( 'postcss-browser-reporter' )(),
                    require( 'postcss-reporter' )()
                ]

            },
            src: 'library/styles/index.css',
            dest: 'library/dist/index.css'
        },
        prefixed: {
            options: {
                processors: [
                    require( 'postcss-prefix-selector' )({
                        prefix: '.sugar-example'
                    })
                ]
            },
            src: 'library/dist/index.css',
            dest: 'library/dist/prefixed-index.css'
        }
    });

    grunt.loadNpmTasks( 'grunt-postcss' );
};
