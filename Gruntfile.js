module.exports = function ( grunt ) {

    /* Configure */
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        // assemble: {
        //     options: {
        //         flatten: true,
        //         assets: 'library',
        //         layoutdir: 'styleguide/src/templates',
        //         layout: 'home.hbs',
        //         helpers: [
        //             'grunt/assemble/helpers/assemble-helper-component/helper-component.js'
        //         ]
        //     },
        //     docs: {
        //         files: {
        //             'styleguide/build/index.html': ['demo/documentati4on/pattern-library/sources/templates/**/*.md']
        //         }
        //     }
        // }
        // steps: {
        //     target1: {
        //         blue: '12'
        //     },
        //     target2: {
        //         red: 'yellow'
        //     }
            // options: {
            //     flatten: true,
            //     assets: 'library',
            //     layoutdir: 'demo/documentation/pattern-library/sources/templates',
            //     layout: 'home.hbs',
            //     helpers: [
            //         'grunt/assemble/helpers/assemble-helper-component/helper-component.js'
            //     ]
            // },
            // docs: {
            //     files: {
            //         'demo/documentation/test/index.html': ['demo/documentation/account-info/*.md']
            // }
        // }
    });

    /* Load tasks */
    grunt.loadTasks( 'grunt' );
    // grunt.registerMultiTask('steps', 'examples of using steps in assemble', function()  {
    //   var  done = this.async();
    //   grunt.verbose.writeln(('Running '  + this.name + ' - '  + this.target).cyan);
    //   // require assemble
    //   var assemble = require('assemble').init( this );
    //   // initalize assemble with the currently running task
    //   assemble = assemble.init(this );
    //   // let's see what assemble has now
    //   grunt.verbose.writeln(require('util' ).inspect(assemble));
    //   grunt.verbose.writeln('' );
    //   // you can see there are some defaults that assemble sets up
    //   // add the steps you want to execute
    //   // add a custom string property to the assemble object
    //   assemble.step(function (assemble, next)  {
    //     grunt.log.writeln('running step 1' );
    //     assemble.step1 = 'This is step 1';
    //     next(assemble);
    //   });
    //   // add a custom object property to the assemble object
    //   assemble.step(function (assemble, next)  {
    //     grunt.log.writeln('running step 2' );
    //     assemble.step2 = {
    //       data: 'This is step 2'
    //     };
    //     next(assemble);
    //   });
    //   // add a custom array property to the assemble object
    //   assemble.step(function (assemble, next)  {
    //     grunt.log.writeln('running step 3' );
    //     assemble.step3 = ['This is step 3' ];
    //     next(assemble);
    //   });
    //   // the last step will use the custom properties set up in the first 3 steps
    //   assemble.step(function (assemble, next)  {
    //     grunt.log.writeln('running step 4' );
    //     grunt.log.writeln('  data from other steps: ' );
    //     grunt.log.writeln('    '  + assemble.step1);
    //     grunt.log.writeln('    '  + assemble.step2.data);
    //     grunt.log.writeln('    '  + assemble.step3[0 ]);
    //     grunt.log.writeln('' );
    //     next(assemble);
    //   });
    //   // now run build
    //   assemble.build(function (err, results)  {
    //     grunt.log.writeln('build finished' );
    //     done();
    //   });
    // });

    /* Task aliases */
    grunt.registerTask( 'default', 'build.', [
        'assemble'
    ]);
};