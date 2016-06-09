var library = {
    settings: {
        dest: 'documentation',
        title: 'Pattern Library'
    },
    sections: [
        {
            title: 'Colors',
            files: 'library/styles/config/colors.css',
            type: 'variable',
            template: 'section-color'
        },
        {
            title: 'Variables',
            files: 'library/styles/config/variables.css',
            type: 'variable'
        },
        {
            title: 'Note',
            files: 'library/styles/note/*.css'
        }
    ]
};

module.exports = library;