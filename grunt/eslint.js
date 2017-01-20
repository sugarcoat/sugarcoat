/*
 * Eslint Configuration
 *
 * See all rules: http://eslint.org/docs/rules/
 * See all options: http://eslint.org/docs/user-guide/configuring
 */
module.exports = function ( grunt ) {

    'use strict';

    grunt.config( 'eslint', {
        src: [
            'lib/*.js',
            'generators/*.js',
            'generators/pattern-library/**/*.js',
            'grunt/*.js',
            'Gruntfile.js',
            '!generators/pattern-library/examples/**/*.js'
        ]
    });

    grunt.loadNpmTasks( 'grunt-eslint' );
};
