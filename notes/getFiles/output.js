({
    //The pattern library will be created and include documentation for colors,
    //typography, UI elements and more complex components.
    patterns: {
        settings: {
            dest: 'demo/documentation/pattern-library',
            //include path to where the templates will live for the pattern library
            template: 'demo/documentation/pattern-library/sources/templates'
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
                    'demo/library/styles/global/buttons.scss',
                    'demo/library/styles/global/colors.scss',
                    'demo/library/styles/global/feedback.scss',
                    'demo/library/styles/global/typography.scss'
                ]
            },
            {
                title: 'Typography',
                files: 'demo/library/styles/global/typography.scss',
                type: 'variables',
                template: 'typography'
            }
        ]
    },
    documentation: {
        settings: {},
        //ReadMes is an option that will allow you to choose if you want any of the 
        //project's readme files to be available within the documentation.
        sections: [
            {
                title: 'Frameworks',
                files: [
                    'demo/documentation/build/frameworks/readme.md',
                    'demo/documentation/build/frameworks/research.md'
                ]
            },
            {
                title: 'Workflows',
                files: [
                    'demo/documentation/workflows/env-setup.md',
                    'demo/documentation/workflows/release-process.md'
                ]
            }
        ]
    }
});