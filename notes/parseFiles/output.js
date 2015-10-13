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
                files: [
                    {
                        path: 'demo/library/styles/global/colors.scss',
                        data: {/*...*/}
                    }
                ],
                type: 'variables',
                template: 'color'
            },
            {
                title: 'Components',
                files: [
                    {
                        path: 'demo/components/*.html',
                        data: {/*...*/}
                    }
                ]
            },
            {
                title: 'UI Kit',
                files: [
                    {
                        path: 'demo/library/styles/global/buttons.scss',
                        data: {/*...*/}
                    },
                    {
                        path: 'demo/library/styles/global/colors.scss',
                        data: {/*...*/}
                    },
                    {
                        path: 'demo/library/styles/global/feedback.scss',
                        data: [
                            {
                                tags: [
                                    {
                                        tag: 'module',
                                        description: ' tooltip',
                                        name: '',
                                        optional: false,
                                        type: '',
                                        line: 3,
                                        source: '@module tooltip'
                                    }, {
                                        tag: 'namespace',
                                        description: ' .tooltip',
                                        name: '',
                                        optional: false,
                                        type: '',
                                        line: 4,
                                        source: '@namespace .tooltip'
                                    }, {
                                        tag: 'desc',
                                        description: ' This module adds the \'.active\' class to a tooltip to open it, and listens for an outside click to close it.',
                                        name: '',
                                        optional: false,
                                        type: '',
                                        line: 5,
                                        source: '@desc This module adds the \'.active\' class to a tooltip to open it, and listens for an outside click to close it.'
                                    }
                                ],
                                line: 1,
                                description: '',
                                source: '@module tooltip\n@namespace .tooltip\n@desc This module adds the \'.active\' class to a tooltip to open it, and listens for an outside click to close it.',
                                code: '\n \n.flash-block {\n    border:1px solid grey;\n    margin:20px;\n}\n/* hello */\n.flash-block-content {\n    padding:20px;\n}\n.flash-block-success {\n    background-color:green;\n    color:white;\n}\n\n'
                            }
                        ]
                    },
                    {
                        path: 'demo/library/styles/global/typography.scss',
                        data: {/*...*/}
                    
                    }
                ]
            },
            {
                title: 'Typography',
                files: [
                    {
                        path: 'demo/library/styles/global/typography.scss',
                        data: {/*...*/}
                    }
                ],
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
                    {
                        path: 'demo/documentation/build/frameworks/readme.md',
                        data: {/*...*/}
                    },
                    {
                        path: 'demo/documentation/build/frameworks/research.md',
                        data: {/*...*/}
                    }
                ]
            },
            {
                title: 'Workflows',
                files: [
                    {
                        path: 'demo/documentation/workflows/env-setup.md',
                        data: {/*...*/}
                    },
                    {
                        path: 'demo/documentation/workflows/env-release-process.md',
                        data: {/*...*/}
                    }
                ]
            }
        ]
    }
});