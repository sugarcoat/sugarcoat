module.exports = function ( grunt ) {

    /* Configure */
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' )
    });

    /* Load tasks */
    grunt.loadTasks( 'grunt' );

    /* Task aliases */
    grunt.registerTask( 'default', 'build.', [
        'assemble'
    ]);
};