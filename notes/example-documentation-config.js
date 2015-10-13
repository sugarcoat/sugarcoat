var config = {
    documentation: {
        settings: {},
        //ReadMes is an option that will allow you to choose if you want any of the 
        //project's readme files to be available within the documentation.
        sections: [
            {
                title: 'Frameworks',
                files: 'demo/documentation/frameworks/'
            },
            {
                title: 'Frameworks2',
                files: 'demo/documentation/frameworks'
            },
            {
                title: 'Frameworks3',
                files: 'demo/documentation/frameworks/*'
            },
            {
                title: 'Workflows',
                files: 'demo/documentation/workflows/*'           
            }
        ]
    }
};

module.exports = config;