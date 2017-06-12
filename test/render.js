'use strict';

var assert = require( 'chai' ).assert;
var fs = require( 'fs-extra' );
var path = require( 'path' );

var sugarcoat = require( '../lib/index' );
var fsp = require( '../lib/fs-promiser' );

// suite( 'Render: renderLayout', function() {});
    // test that the rendered html file is as it should be?

suite( 'Render: File Prefixer', function () {

    test( 'By default, assets are prefixed as .sugar-example. Output file is prefixed with "prefixed-"',  done => {

        var config = {
            dest: './test/sugarcoat',
            include: {
                css: [
                    './test/assert/prefixAssets.css'
                ]
            },
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

        var setupFiles = [
            './test/assert/prefixAssets-assertDefault.css',
            './test/sugarcoat/sugarcoat/css/prefixed-prefixAssets.css'
        ];

        sugarcoat( config )
        .then( () => {

            return Promise.all( setupFiles.map( fsp.readFile ))
            .then( assets => {

                assert.equal( assets[ 0 ], assets[ 1 ], 'prefixAssets-assertDefault.css matches');
                done();
            });
        });
    });

    test( 'Prefixed output should use the selector designated in the config: `prefix.selector`', done => {

        var config = {
            dest: './test/sugarcoat',
            template: {
                selectorPrefix: '.designated-prefix'
            },
            include: {
                css: [
                    './test/assert/prefixAssets.css'
                ]
            },
            sections: [
                {
                    title: 'CSS File',
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        var setupFiles = [
            './test/assert/prefixAssets-assert.css',
            './test/sugarcoat/sugarcoat/css/prefixed-prefixAssets.css'
        ];

        sugarcoat( config )
        .then( () => {

            return Promise.all( setupFiles.map( fsp.readFile ))
            .then(  assets => {
                assert.equal( assets[ 0 ], assets[ 1 ], 'prefixAssets-assert.css matches');
                done();
            });
        });
    });

    teardown( done => {

        fs.remove( './test/sugarcoat', err => {

            if ( err ) return console.error( err );

            done();
        });
    });
});

suite( 'Render: Copy Assets', function () {

    test( 'Any files in Copy are added to the sugarcoat folder.', done => {

        var configCopyAssets = {
            dest: './tester/sugarcoat',
            copy: [
                './test/assert/displayGraphic.png'
            ],
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

        sugarcoat( configCopyAssets )
        .then( data => {

            var filePath = path.resolve( data.dest, path.relative( data.copy[0].options.cwd, data.copy[0].src ) );

            fs.access( filePath, 0, err => {

                var exists;

                if ( !err ) exists = true;
                else exists = false;

                assert.isTrue( exists, 'Sugarcoat added the file.' );

                done();
            });
        });
    });

    teardown( done => {

        fs.remove( './tester', err => {

            if ( err ) return console.error( err );

            done();
        });
    });
});

suite( 'Render: Custom Layout and Partials', function () {

    test( 'Custom Partials output is exactly as it should be.', ( done )  => {

        var configCustomPartial = {
            dest: './test/sugarcoat',
            template: {
                partials: {
                    'head': './test/assert/renderCustomPartial.hbs'
                }
            },
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

        sugarcoat( configCustomPartial )
        .then( function ( data ) {

            fs.readFile( './test/sugarcoat/index.html', 'utf8', ( error, fileData ) => {

                if ( error ) assert.fail( error );
                else {

                    var exp = /(<!-- Test custom partial -->)/;
                    var partial = exp.exec( fileData.toString() )[1];
                    assert.equal( partial, '<!-- Test custom partial -->', 'The custom partial was used.');
                    done();
                }
            });

        }).catch( error => {

            assert.notTypeOf( error, 'Error', 'Error is not an Error object.' );
        });
    });

    test( 'Custom Layout output is exactly as it should be.', function ( done ) {

        var configCustomLayout = {
            dest: './test/sugarcoat',
            template: {
                layout: './test/assert/renderCustomLayout.hbs'
            },
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

        sugarcoat( configCustomLayout )
        .then( function ( data ) {

            fs.readFile( './test/sugarcoat/index.html', 'utf8', ( error, fileData ) => {

                if ( error ) assert.fail( error );
                else {

                    var exp = /(<!-- Test custom Layout -->)/;
                    var layout = exp.exec( fileData.toString() )[1];
                    assert.equal( layout, '<!-- Test custom Layout -->', 'The custom layout was used.');
                    done();
                }
            });

        }).catch( error => {

            assert.notTypeOf( error, 'Error', 'Error is not an Error object.' );
        });

    });

    teardown( done => {

        fs.remove( './test/sugarcoat', err => {

            if ( err ) return console.error( err );

            done();
        });
    });
});