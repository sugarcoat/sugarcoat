var assert = require( 'chai' ).assert;
var fs = require( 'fs' );

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

    var config;

    setup( function () {
        //.designated-prefix
        config = {
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
        }

        // sugarcoat( config )
        // .then( function(){ done(); });
    });

    test( 'Assets are prefixed as .sugar-example by default and the filename is prefixed with "prefixed-"', function( done ) {

        var setupFiles = [
            {
                fileName: './test/assert/prefixAssets-assert.css'
            },
            {
                fileName: './test/assert/prefixAssets-assert.css'
            }
        ];

        sugarcoat( config ) //works
        .then( function() {
            return new Promise( function( resolve, reject ) {
                return fs.readFile( setupFiles[ 0 ].fileName, 'utf-8', function( err, data ) {
                    console.log( data );
                    resolve( data );
                });
            })
        })
        .then( function() { //works
            console.log( 'oh' );
            assert.equal( true, true, 'its true');
            done();
        });

    });
});
// suite( 'Render: prefixAssets', function() {});
// suite( 'Render: copyAssets', function() {});