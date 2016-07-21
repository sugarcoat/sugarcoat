module.exports = function ( grunt ) {

    /* Configure */
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        buildRoot: '/',
    });

    /* Load tasks */
    grunt.loadTasks( 'grunt' );

    grunt.registerTask( 'css', 'Pre and Post process CSS', [ 'postcss:foo', 'postcss:prefixed' ]);

};