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
                                        description: 'Flashblock',
                                        optional: false,
                                        type: '',
                                        name: '',
                                        line: 3,
                                        source: '@module Flashblock'
                                    },
                                    { 
                                        tag: 'category',
                                        description: 'Feedback',
                                        optional: false,
                                        type: '',
                                        name: '',
                                        line: 4,
                                        source: '@category Feedback'
                                    },
                                    { 
                                        tag: 'example',
                                        description: '<div class="flash-block">\n<div class="flash-block-content">\nSuccess Message\n</div>\n</div>',
                                        optional: false,
                                        type: '',
                                        name: '',
                                        line: 5,
                                        source: '@example\n<div class="flash-block">\n<div class="flash-block-content">\nSuccess Message\n</div>\n</div>'
                                    },
                                    { 
                                        tag: 'modifier',
                                        name: '.flash-block-success',
                                        description: 'JS added class that disables the block disappearing',
                                        optional: false,
                                        type: '',
                                        line: 11,
                                        source: '@modifier .flash-block-success JS added class that disables the block disappearing'
                                    },
                                    { 
                                        tag: 'modifier',
                                        name: ':focus ',
                                        description: 'Special animated hover focus state',
                                        optional: false,
                                        type: '',
                                        line: 12,
                                        source: '@modifier :focus Special animated hover focus state'
                                    },
                                    { 
                                        tag: 'modifier',
                                        name: ':hover ',
                                        description: 'Special animated hover focus state',
                                        optional: false,
                                        type: '',
                                        line: 13,
                                        source: '@modifier :hover Special animated hover focus state'
                                    }
                                ],
                                line: 0,
                                description: 'A block of info that persists for ~2 seconds on the page',
                                source: 'A block of info that persists for ~2 seconds on the page\n\n@module Flashblock\n@category Feedback\n@example\n<div class="flash-block">\n     <div class="flash-block-content">\n         Success Message\n     </div>\n</div>\n@modifier .flash-block-success JS added class that disables the block disappearing\n@modifier :focus Special animated hover focus state\n@modifier :hover Special animated hover focus state',
                                code: '<div class="flash-block">\n    <div class="flash-block-content">\n        Success Message\n    </div>\n</div>'
                            },
                            { 
                                tags: [
                                    { 
                                        tag: 'module',
                                        description: 'Tooltip',
                                        optional: false,
                                        type: '',
                                        name: '',
                                        line: 3,
                                        source: '@module Tooltip'
                                    },
                                    { 
                                        tag: 'example',
                                        description: '<div class="flash-block flash-block-success">\n<div class="tooltip">\n<span class="tooltip-content">This is a tooltip</span>\n</div>\n</div>',
                                        optional: false,
                                        type: '',
                                        name: '',
                                        line: 4,
                                        source: '@example\n<div class="flash-block flash-block-success">\n<div class="tooltip">\n<span class="tooltip-content">This is a tooltip</span>\n</div>\n</div>'
                                    },
                                    { 
                                        tag: 'modifier',
                                        name: '.active ',
                                        description: 'enabled class on .tooltip',
                                        optional: false,
                                        type: '',
                                        line: 10,
                                        source: '@modifier .active enabled class on .tooltip'
                                    }
                                ],
                                line: 0,
                                description: 'A tooltip appearing in small viewport only',
                                source: 'A tooltip appearing in small viewport only\n\n@module Tooltip\n@example\n <div class="flash-block flash-block-success">\n     <div class="tooltip">\n         <span class="tooltip-content">This is a tooltip</span>\n     </div>\n </div>\n@modifier .active enabled class on .tooltip',
                                code: '<div class="flash-block flash-block-success">\n    <div class="tooltip">\n        <span class="tooltip-content">This is a tooltip</span>\n    </div>\n</div>'
                            }
                        ]
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