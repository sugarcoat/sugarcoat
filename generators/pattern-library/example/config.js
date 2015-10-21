/*
 * This is the configuration file that is needed to create the real 
 * documentation such as the pattern library. 
 *
 * When a new project is created this file will need to be updated with the
 * correct paths from your project.
 *
 */
var patterns = {
    //The pattern library will be created and include documentation for colors,
    //typography, UI elements and more complex components.
<<<<<<< HEAD
    settings: {
        dest: 'demo/documentation/pattern-library',
        //include path to where the templates will live for the pattern library
        template: 'demo/documentation/templates/main.hbs'
    },
    sections: [
        {
            title: 'Colors',
            files: 'demo/library/styles/global/colors.scss',
            type: 'variables',
            template: 'color'
        },
        {
            title: 'Components',
            files: 'demo/components/*.html'
=======
    patterns: {
        settings: {
            dest: 'demo/documentation/pattern-library',
            //include path to where the templates will live for the pattern library
            template: 'demo/documentation/templates/main.hbs'
>>>>>>> d43c7965db1c4ae2331c4e0c8d33bbbde51b4ccd
        },
        // what about 'not' typography?
        {
            title: 'UI Kit',
            files: {
                src: [ 
                    'demo/library/styles/base/feedback.scss',
                    'demo/library/styles/global/*.scss',
                    'demo/library/styles/global/*',
                    '!demo/library/styles/global/typography.scss',
                    '!demo/library/styles/global/colors.scss'
                ],
                options: {}
            }
        },
        {
            title: 'Typography',
            files: 'demo/library/styles/global/typography.scss',
            type: 'variables',
            template: 'typography'
        }
    ]
};

module.exports = patterns;