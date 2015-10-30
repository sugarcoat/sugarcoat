/*
 * This is the configuration file that is needed to create the real 
 * documentation such as the pattern library. 
 *
 * When a new project is created this file will need to be updated with the
 * correct paths from your project.
 *
 */
var patterns = {
    settings: {
        dest: 'demo/documentation/pattern-library',
        //include path to where the layout will live for the pattern library
        layout: 'generators/patternno-library/templates/main.hbs',
        partials: 'generators/pattern-library/templates/customPartials'
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
        },
        {
            title: 'UI Kit',
            files: [ 
                'demo/library/styles/base/feedback.scss',
                'demo/library/styles/global/*.scss',
                '!demo/library/styles/global/typography.scss',
                '!demo/library/styles/global/colors.scss'
            ]
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