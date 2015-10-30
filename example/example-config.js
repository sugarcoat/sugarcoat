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
        dest: 'documentation/pattern-library',
        //include path to where the layout will live for the pattern library
        layout: '../generators/pattern-library/templates/main.hbs',
        partials: '../generators/pattern-library/templates/customPartials'
    },
    sections: [
        {
            title: 'Colors',
            files: 'library/styles/global/colors.scss',
            type: 'variables',
            template: 'color'
        },
        {
            title: 'Components',
            files: 'components/*.html'
        },
        {
            title: 'UI Kit',
            files: [
                'library/styles/base/feedback.scss',
                'library/styles/global/*.scss',
                '!library/styles/global/typography.scss',
                '!library/styles/global/colors.scss'
            ]
        },
        {
            title: 'Typography',
            files: 'library/styles/global/typography.scss',
            type: 'variables',
            template: 'typography'
        }
    ]
};

module.exports = patterns;