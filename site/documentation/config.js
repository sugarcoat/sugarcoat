var library = {
    settings: {
        dest: './documentation',
        title: 'Pattern Library',
        template: {
            partials: [
                'documentation/template'
            ]
        }
    },
    sections: [
        {
            title: 'Colors',
            files: 'library/styles/config/colors.css',
            type: 'variable',
            template: 'section-color'
        },
        {
            title: 'Typography',
            files: 'library/styles/base/typography.css',
            type: 'variable',
            template: 'section-typography'
        },
        {
            title: 'Variables',
            files: 'library/styles/config/variables.css',
            type: 'variable'
        },
        {
            title: 'Mixins',
            files: 'library/styles/config/mixins.css'
        },
        {
            title: 'Elements',
            files: 'library/styles/base/buttons.css'
        },
        {
            title: 'Components',
            files: [
                'library/styles/note/*.css',
                'library/styles/feature/*.css'
            ]
        }
    ]
};

module.exports = library;