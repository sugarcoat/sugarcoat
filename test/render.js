var assert = require( 'chai' ).assert;
var fs = require( 'fs-extra' );
var fsp = require( 'fs-promise' );

var sugarcoat = require( '../index' );

/**
 *
 * consume assets (nested)
 * prefix assets (default and specified prefix)
 * output head.hbs (template verification?)
 *
 */

// suite( 'Render: globPartials', function() { test( '', function() {});});
// suite( 'Render: readPartials', function() {});
// suite( 'Render: registerPartials', function() {});
// suite( 'Render: renderLayout', function() {});
suite( 'Render', function() {

    test( 'By default, assets are prefixed as .sugar-example. Output file is prefixed with "prefixed-"', function( done ) {

        var config = {
            settings: {
                dest: './test/sugarcoat',
                prefix: {
                    assets: [
                        './test/assert/prefixAssets.css'
                    ]
                    // selector: '.designated-prefix'
                }
            },
            sections: [
                {
                    title: 'CSS File',
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        var setupFiles = [
            {
                fileName: './test/assert/prefixAssets-assertDefault.css'
            },
            {
                fileName: './test/sugarcoat/sugarcoat/css/prefixed-prefixAssets.css'
            }
        ];

        function promiseAssets() {

            return Promise.all( setupFiles.map( function( asset ) {

                return new Promise( function( resolve, reject ) {

                    fs.readFile( asset.fileName, 'utf-8', function( err, data ) {

                        asset.data = data;
                        resolve();
                    });
                });
            }));
        };

        sugarcoat( config )
        .then( function() {

            return promiseAssets()
            .then( function( assets ) {
                assert.equal( setupFiles[ 0 ].data, setupFiles[ 1 ].data, 'prefixAssets-assertDefault.css matches');
                done();
            });
        });
    });

    test( 'Prefixed output should use the selector designated in the config: `prefix.selector`', function( done ) {

        var config = {
            settings: {
                dest: './test/sugarcoat',
                prefix: {
                    assets: [
                        './test/assert/prefixAssets.css'
                    ],
                    selector: '.designated-prefix'
                }
            },
            sections: [
                {
                    title: 'CSS File',
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        var setupFiles = [
            {
                fileName: './test/assert/prefixAssets-assert.css'
            },
            {
                fileName: './test/sugarcoat/sugarcoat/css/prefixed-prefixAssets.css'
            }
        ];

        function promiseAssets() {

            return Promise.all( setupFiles.map( function( asset ) {

                return new Promise( function( resolve, reject ) {

                    fs.readFile( asset.fileName, 'utf-8', function( err, data ) {

                        asset.data = data;
                        resolve();
                    });
                });
            }));
        };

        sugarcoat( config )
        .then( function() {

            return promiseAssets()
            .then( function( assets ) {
                assert.equal( setupFiles[ 0 ].data, setupFiles[ 1 ].data, 'prefixAssets-assert.css matches');
                done();
            });
        });
    });

    teardown( function ( done ) {

        fs.remove( './test/sugarcoat', function ( err ) {

            if ( err ) return console.error( err );

            done();
        });
    });
});
// suite( 'Render: prefixAssets', function() {});
// suite( 'Render: copyAssets', function() {});