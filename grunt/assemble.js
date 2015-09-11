/*
 * Assemble Configuration
 * Documentation: http://assemble.io/docs
 */
module.exports = function ( grunt ) {

    grunt.config( 'assemble', {
        options: {
            flatten: true,
            assets: 'library',
            // data: 'demo/documentation/account-info/readme.json',
            layoutdir: 'demo/documentation/pattern-library/sources/templates',
            layout: 'home.hbs',
            helpers: [
                'grunt/assemble/helpers/assemble-helper-component/helper-component.js'
            ]
        },
        accountInfo: {
            options: {
                myData: 'something'
            },
            files: {
                'demo/documentation/account-info/': ['demo/documentation/account-info/*.md']
            }
        },
    });
    
    grunt.loadNpmTasks( 'assemble' );
};