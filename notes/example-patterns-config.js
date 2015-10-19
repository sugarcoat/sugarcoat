var config = {
    patterns: {
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
            },
            // what about 'not' typography?
            {
                title: 'UI Kit',
                files: [ 
                    'demo/library/styles/base/feedback.scss',
                    'demo/library/styles/global/'
                ]
            },
            {
                title: 'Typography',
                files: 'demo/library/styles/global/typography.scss',
                type: 'variables',
                template: 'typography'
            }
        ]
    }
};

module.exports = config;