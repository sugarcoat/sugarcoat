/*
 * Assemble Configuration
 * Documentation: http://assemble.io/docs
 */
module.exports = function ( grunt ) {

    grunt.config( 'assemble', {
        options: {
            flatten: true,
            assets: 'clientlib',
            layoutdir: 'grunt/assemble/templates/layouts',
            layout: 'home.hbs',
            helpers: [
                'grunt/assemble/helpers/assemble-helper-component/helper-component.js'
            ]
        },
        
        docs: {
            files: {
                'styleguide/build/index.html': ['styleguide/src/*.md']
            }
        },
        //
        // // Compile .hbs files into HTML pages
        // handlebars: {
        //     files: [
        //         {
        //             expand: true,
        //             cwd: 'styleguide/src',
        //             src: [
        //                 '*.hbs'
        //             ],
        //             dest: 'styleguide/build/'
        //         }
        //     ]
        // },

        // Compile Markdown files into HTML pages
        // markdown: {
        //     options: {
        //         layout: 'default.hbs',
        //     },
        //     files: [
        //         {
        //             expand: true,
        //             cwd: 'styleguide/src',
        //             src: [
        //                 '*.md'
        //             ],
        //             dest: 'styleguide/build/components',
        //             ext: '.html'
        //         }
        //     ],
        // }
    });

    grunt.loadNpmTasks( 'assemble' );
};