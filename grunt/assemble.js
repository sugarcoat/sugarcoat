/*
 * Assemble Configuration
 * Documentation: http://assemble.io/docs
 */
module.exports = function ( grunt ) {

    grunt.config( 'assemble', {
        options: {
            flatten: true,
            assets: 'library',
            layoutdir: 'styleguide/src/templates',
            layout: 'home.hbs',
            helpers: [
                'grunt/assemble/helpers/assemble-helper-component/helper-component.js'
            ]
        },
        
        docs: {
            files: {
                'styleguide/build/index.html': ['styleguide/src/components/*.md']
            }
        },
    });

    grunt.loadNpmTasks( 'assemble' );
};