/*
 * This is the configuration file that is needed to create the real 
 * documentation such as the pattern library. 
 *
 * When a new project is created this file will need to be updated with the
 * correct paths from your project.
 *
 */
var documentation = {
    settings: {},
    //ReadMes is an option that will allow you to choose if you want any of the 
    //project's readme files to be available within the documentation.
    sections: [
        {
            title: 'Frameworks',
            files: 'demo/documentation/frameworks/*'
        },
        {
            title: 'Workflows',
            files: 'demo/documentation/workflows/*'           
        }
    ]
};

module.exports = config;