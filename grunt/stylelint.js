/*
 * Stylelint Configuration
 *
 * See all options: https://github.com/wikimedia/grunt-stylelint
 * Based on: https://github.com/stylelint/stylelint/
 */
module.exports = function ( grunt ) {

    grunt.config( 'stylelint', {
        lint: {
            options: {
                debug: true,
                reporters: [
                    {
                        formatter: 'string',
                        console: true
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: 'generators/pattern-library/templates',
                    src: [
                        'styles/**/*.scss'
                    ],
                    dest: 'generators/pattern-library/templates',
                    ext: 'styles/**/*.css'
                }
            ]
        }
    });

    grunt.loadNpmTasks( 'grunt-stylelint' );
};
