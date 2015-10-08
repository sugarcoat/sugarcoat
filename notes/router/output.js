({
    generators: {
        //environment information will include breakpoints. This is required, but if
        //do not have a file with all of the breakpoints you may give it an array.
        envInfo: {
            breakpoints: [
                [ '0', '435' ],
                [ '640', '1024' ],
                [ '1153' ]
            ]
        },
        // sends to pattern library generator
        patternLibrary: {
            options: {
                dest: 'demo/documentation/pattern-library',
                srcTemplates: 'demo/documentation/pattern-library/sources/templates'
            },
            typography: {
                path: 'demo/library/styles/global/typography.scss',
                data: [
                    {
                        type: 'title',
                        content: 'Some Component'
                    },
                    {
                        type: 'description',
                        content: 'This componenet was created to add a certain type of functionality to cart pages. It was requested by the client.'
                    },
                    {
                        type: 'usage',
                        content: 'Mainly used on cart pages.'
                    },
                    {
                        type: 'functionality',
                        content: 'Once added to a cart page, this module will sit there until clicked on. Once clicked on the module will open a modal that includes information needed by the user about the cart.'
                    },
                    {
                        type: 'dependencies',
                        content: '/library/js/modules/some-component.js, /library/js/modules/other-component.js'
                    },
                    {
                        type: 'content',
                        content: '<ul class="some-component">\n  <li>Item One</li>\n  <li>Item Two</li>\n</ul>'
                    }
                ]
            },
            colors: {},
            components: [
                {},
                {},
                {}
            ],
            elements: [
                {},
                {},
                {}
            ],
            modules: [
                {},
                {},
                {}
            ]
        },
        // sends to documentation readmes generator
        documentation: {
            frameworks: {},
            workflows: {
                jira: {},
                releaseProcess: {}
            },
            // for multiple documents in a folder
          	codestyleguide: {
          		css: {},
          		html: {},
                javascript: {}
           	}
        }
    }
    
});