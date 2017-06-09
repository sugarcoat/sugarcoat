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

// test out if a rendered custom patial worked correctly
//
// same for custom layout

suite( 'Render: Custom Layout and Partials', function () {

    test( 'Custom Partials output is exactly as it should be.', () => {

        // create test partial
        // create test data file
        // run sc, read file and compare section to expected output

        var configCustomPartial = {
            dest: './test/sugarcoat',
            template: {
                layout: './test/assert/rednerCustomLayout.hbs',
                partials: {
                    'head': '',
                    'nav': '',
                    'footer': '',
                    'section-color': '',
                    'section-typography': '',
                    'section-variable': '',
                    'section-default': '',
                    'custom-partial': '.test/assert/renderCustomPartial.hbs'
                }
            },
            sections: [
                {
                    title: 'test',
                    files: './test/assert/renderPartial.html'
                }
            ]
        };

        // var partialExpected = '';

        sugarcoat( configCustomPartial )
        .then( data => {
            console.log(data);
            // fs.readFile( './test/sugarcoat/index.html', 'utf8', ( error, fileData ) => {

                // console.log( fileData );
                // var exp = /<section class="sugar-section">(\s|\S)*<\/section>/;
                // var partialSection = exp.exec( fileData.toString() );
                // console.log(partialSection);
                // assert.equal( title, 'Pattern Library'
                // done();
            // });
        }, data => {
            done();
        });
    });

    // test( 'Custom Layout output is exactly as it should be.', function () {

    //     // replicate above but test the whole output
    // });
});