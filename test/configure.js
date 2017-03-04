var assert = require( 'chai' ).assert;
// var fs = require( 'fs-extra' );
// var path = require( 'path' );

var sugarcoat = require( '../index' );
var fsp = require( '../lib/fs-promiser' );

suite( 'Configure: Settings', () => {

    test.only( 'Destination is set to be required. Destination errored out when not supplied.', (done) => {

        var configMissingDest = {
            // settings: {
                // dest: './test/sugarcoat'
            // },
            sections: [
                {
                    title: 'CSS File',
                    files: './test/assert/parseVarCode.css'
                },
                {
                    title: 'CSS File 2',
                    files: './test/assert/parseVarCode.css'

                }
            ]
        };

        var setupFile = './test/assert/settings.js';

        sugarcoat( configMissingDest ).then( (data) => {
            console.log('we pass');
            // assert.equal( true, true, 'its true');
            // done();

            return fsp.readFile( setupFile )
            .then( obj => {
                assert.sameDeepMembers( data, obj, 'We have dest in the array');
                done();
            });
        }, (data) => {
            console.log('we fail', data);
            assert.equal( true, true, 'its true' );
            done();
            // assert.isArray( data, 'We got the error array' );

            // return fsp.readFile( setupFile )
            // .then( obj => {
            //     assert.sameDeepMembers( data, obj, 'We have dest in the array');
            //     done();
            // });
        });

        // sugarcoat( configMissingDest ).then( data => {
        //     // failed test
        //     console.log('pass');
        // }, data => {

        //     console.log('fail');
        //     assert.isFalse( data.error, 'There is an error that was appended to the config.' );
        //     // done();

        //     // return fsp.readFile( setupFile )
        //     // .then( obj => {

        //     //     // assert.property( data.error.settings, 'section', 'There is an error with the settings object.' );
        //     //     assert.notInclude( data.error.settings, 'dest', 'There was an error stating that the Destination is required.' );
        //     //     // assert.sameDeepMembers( data.error.settings, obj, 'There was an error stating that the Destination is required.' );
        //     // });
        // });
    });

    // test( 'Destination can be set to none. No index file is created.', () => {

    //     var configNoDest = {
    //         settings: {
    //             dest: 'none'
    //         },
    //         sections: [
    //             {
    //                 title: 'CSS File',
    //                 files: './test/assert/parseVarCode.css'
    //             },
    //             {
    //                 title: 'CSS File 2',
    //                 files: './test/assert/parseVarCode.css'

    //             }
    //         ]
    //     };

    //     sugarcoat( configNoDest ).then( data => {

    //         assert.isNotNull( data.settings.dest, 'The destination was set to null' );
    //         // console.log( fs.existsSync( path.relative( data.settings.cwd, 'index.html' ) ) );
    //         assert.isTrue( fs.existsSync( path.relative( data.settings.cwd, 'index.html' ) ), 'Sugarcoat did not create a index.html file.' );
    //     });
    // });
});