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
        // render = render( config );
        // sugarcoat( config );
    });

    test( 'Assets are prefixed as .sugar-example by default and the filename is prefixed with "prefixed-"', function() {


        return sugarcoat( config )
        .then( function( result ) {

            fs.readFile( './test/assert/prefixAssets-assert.css', 'utf-8', function( err, data ) {
                console.log( data );

                if ( err ) {
                    return false;
                }
                else {
                    console.log( data );
                    return data;
                }
            });
        });
    });
});
// suite( 'Render: prefixAssets', function() {});
// suite( 'Render: copyAssets', function() {});