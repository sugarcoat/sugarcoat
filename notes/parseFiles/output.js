/*
 * This is the configuration file that is needed to create the real 
 * documentation such as the pattern library. 
 *
 * When a new project is created this file will need to be updated with the
 * correct paths from your project.
 *
 */
({
    //The pattern library will be created and include documentation for colors,
    //typography, UI elements and more complex components. This option is required.
    sources: {
        //include path to a CSS/SCSS/LESS file that only includes all of the breakpoints
        settings: {
            breakpoints: [
                [ '0', '435' ],
                [ '640', '1024' ],
                [ '1153' ]
            ]
        },
        sourceCode: {
            //include path to JS files
            modules: [
                'demo/library/js/modules/boilerplate.js',
                'demo/library/js/modules/tooltip.js'
            ],
            //include path to component files
            components: [
                {
                    path: 'demo/components/some-component.html',
                    //AST
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
                }
            ],
            //include path to UI elements
            elements: [
                {
                    path: 'demo/library/styles/global/buttons.scss',
                    data: {}
                },
                'demo/library/styles/global/buttons.scss',
                'demo/library/styles/global/feedback.scss',
                'demo/library/styles/global/colors.scss',
                'demo/library/styles/global/typography.scss'
            ],
            //include path to CSS/SCSS/LESS file that only includes all of the colors
            colors: 'demo/library/styles/global/colors.scss',
            //include path to CSS/SCSS/LESS file that only includes all typography
            typography: 'demo/library/styles/global/typography.scss'
        },
        //ReadMes is an option that will allow you to choose if you want any of the 
        //project's readme files to be available within the documentation. 
        readmes: {
            // adds research readmes if they're the only document available within a folder
          	//research: true,        
            // for one particular document
            frameworks: 'demo/documentation/build/frameworks',
            workflows: {
                jira: 'demo/documentation/workflows/release-process.md',
                releaseProcess: 'demo/documentation/workflows/release-process.md'
            },
            // for multiple documents in a folder
          	codestyleguide: {
          		css: 'demo/documentation/codestyle/css.md',
          		html: 'demo/documentation/codestyle/html.md',
                javascript: 'demo/documentation/codestyle/javascript.md'
           	}
        }
    },
    generators: {
        //environment information will include breakpoints. This is required, but if
        //do not have a file with all of the breakpoints you may give it an array.
        envInfo: {},
        patternLibrary: {
            dest: 'demo/documentation/pattern-library',
            //include path to where the templates will live for the pattern library
            srcTemplates: 'demo/documentation/pattern-library/sources/templates'
        }
    }
    
});