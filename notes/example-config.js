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
            modules: 'demo/library/js/modules/*.js',
            //include path to component files
            components: 'demo/components/*.html',
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