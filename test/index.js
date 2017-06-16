'use strict';

var assert = require( 'chai' ).assert;
var fs = require( 'fs-extra' );

var sugarcoat = require( '../lib/index' );

suite( 'Index: Glob files', function () {

    test( 'Sugarcoat globs our file paths correctly.', function () {

        var globFilesConfig = {
            dest: './test/sugarcoat',
            sections: [
                {
                    title: 'CSS Files',
                    files: [
                        './test/assert/*.css',
                        '!./test/assert/parseComment.css'
                    ]
                }
            ]
        };

        sugarcoat( globFilesConfig )
        .then( data => {

            var fileData = data.sections[ 0 ].files;

            assert.lengthOf( fileData, 5, 'There are 5 files that glob found.' );
            assert.propertyVal( fileData[ 3 ], 'path', './test/assert/prefixAssets.css', 'The fourth item in the array is the correct file.' );

        }, data => {

            assert.isString( data, 'error is not a string' );
        });
    });

    teardown( done => {

        fs.remove( './test/sugarcoat', err => {

            if ( err ) return console.error( err );

            done();
        });
    });
});

