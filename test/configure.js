'use strict';

var assert = require( 'chai' ).assert;
var fs = require( 'fs-extra' );
var path = require( 'path' );

var sugarcoat = require( '../lib/index' );
var errors = require( '../lib/errors' );
var configure = require( '../lib/configure' );

suite( 'Configure: Dest', function () {

    test( 'Destination is set to be required. Destination errored out when not supplied.', () => {

        var configMissingDest = {
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

        sugarcoat( configMissingDest )
        .then( data => {

            assert.instanceOf( data, Error, 'Sugarcoat should be erroring out when a dest is not supplied.');

        }, data => {

            assert.instanceOf( data, Error, 'The object was an Error Object.' );

            assert.propertyVal( data, 'message', errors.configDestMissing, 'Sugarcoat gave us the correct error.' );
        });

    });

    test( 'Destination can be set to none. No index file is created.', () => {

        var configNoDest = {
            dest: 'none',
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

        sugarcoat( configNoDest )
        .then( data => {

            var index = data.dest !== null ? path.resolve( process.cwd(), `${data.dest}/index.html` ) : `${process.cwd()}/index.html`;

            // Note: In Node v4, fs.constants.F_OK was fs.F_OK.
            // fs.constants.F_OK - file is visible to the calling process, which is useful for determining if a file exists.
            // This is just the interger 0, which is why we are using 0 below.
            fs.access( index, 0, ( err ) => {
                var exists;

                if ( !err ) exists = true;
                else exists = false;

                assert.isFalse( exists, 'Sugarcoat did not create a index.html file.' );
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

suite( 'Configure: Display', function () {

    test( 'Display.Title is given default title when none is provided.', ( done ) => {

        var configMissingTitle = {
            dest: './test/sugarcoat',
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

        sugarcoat( configMissingTitle )
        .then( function ( data ) {

            fs.readFile( './test/sugarcoat/index.html', 'utf8', ( error, fileData ) => {

                var exp = /<title>(.*)<\/title>/;
                var title = exp.exec( fileData.toString() )[1];

                assert.equal( title, 'Pattern Library', 'The default title was used.');
            });

            done();

        }).catch( error => {

            assert.isNotObject( error, 'error is not an obj' );
        });
    });

    test( 'Display.Title uses provided title when provided.', ( done ) => {

        var testTitle = 'Test that title out!';
        var configGivenTitle = {
            dest: './test/sugarcoat',
            display: {
                title: `${testTitle}`
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

        sugarcoat( configGivenTitle )
        .then( function ( data ) {

            fs.readFile( './test/sugarcoat/index.html', 'utf8', ( error, fileData ) => {

                var exp = /<title>(.*)<\/title>/;
                var title = exp.exec( fileData.toString() );

                assert.equal( title[1], testTitle, 'The default title was used.');
            });

            done();

        }).catch( error => {

            assert.isNotObject( error, 'error is not an obj' );
        });
    });

    test( 'When Display.graphic is used an image tag is added to the HTML file ', ( done ) => {

        var configGivenImg = {
            dest: './test/sugarcoat',
            display: {
                graphic: './test/assert/displayGraphic.png'
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

        sugarcoat( configGivenImg )
        .then( function ( data ) {

            fs.readFile( './test/sugarcoat/index.html', 'utf8', ( error, fileData ) => {

                var exp = /<div class="sugar-masthead">(\s*|.*)<img src=".*" \/>/;
                var img = fileData.toString().search( exp );

                assert.notEqual( img, '-1', 'There is an image added to the head of the HTML page.');
            });

            done();

        }).catch( error => {

            assert.isNotObject( error, 'error is not an obj' );
        });
    });

    test( 'When Display.headingText is used an H1 tag is added to the HTML file ', ( done ) => {

        var testHeadingText = 'Test Heading Text';
        var configGivenHeadingText = {
            dest: './test/sugarcoat',
            display: {
                headingText: `${testHeadingText}`
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

        sugarcoat( configGivenHeadingText )
        .then( function ( data ) {

            fs.readFile( './test/sugarcoat/index.html', 'utf8', ( error, fileData ) => {

                var exp = /<div class="sugar-masthead">(\s*.*\s*)<h1>(.*)<\/h1>/;
                var h1 = exp.exec( fileData.toString() )[2];

                assert.equal( h1, testHeadingText, 'The heading text given is outputted to the HTML page.');
            });

            done();

        }).catch( error => {

            assert.isNotObject( error, 'error is not an obj' );
        });
    });

    teardown( done => {

        fs.remove( './test/sugarcoat', err => {

            if ( err ) return console.error( err );

            done();
        });
    });
});

suite( 'Configure: Copy', function () {

    test( 'If no assets are provided to copy, default sugarcoat assets are added.', () => {

        var configNoCopy = {
            dest: './test/sugarcoat',
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

        var processedConfig = configure( configNoCopy )
            , regex = /(sugarcoat\/\*\*\/\*)/
            , copySrcPath = processedConfig.copy[0].src.search( regex )
            ;

        assert.notEqual( copySrcPath, -1, 'Sugarcoat default file path was included in copy after configure.' );
    });

    test( 'If sugarcoat is present as well as other copy assets, sugarcoat is included as well.', () => {

        var configOtherAssets = {
            dest: './test/sugarcoat',
            copy: [
                'sugarcoat',
                'test/assert/displayGraphic.png'
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

        var processedConfig = configure( configOtherAssets )
            , regex = /(sugarcoat\/\*\*\/\*)/
            , copySrcPath = processedConfig.copy
            , scIncluded = false
            ;

        copySrcPath.forEach( ( copyObj ) => {

            var copyObjSrc = copyObj.src.search( regex );

            if ( copyObjSrc !== -1 ) {

                assert.notEqual( copyObjSrc, -1, 'We have the SC assets included.' );
                scIncluded = true;
            }
        });

        if ( scIncluded === false ) {

            assert.isTrue( scIncluded, 'Sugarcoat file path was not included in the copy array.');
        }
    });
});

suite( 'Configure: Template', function () {

    test( 'In order to use prefix.selector, prefix.assets must be supplied.', () => {

        var configNoPrefixedAssets = {
            dest: './test/sugarcoat',
            template: {
                selectorPrefix: 'blah'
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

        sugarcoat( configNoPrefixedAssets )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out when prefix.assets is not supplied.');

        }, data => {

            assert.instanceOf( data, Error, 'The object was an Error Object.' );

            assert.propertyVal( data, 'message', errors.configPrefixAssetsMissing, 'Sugarcoat gave us the correct error.' );
        });
    });

    test( 'In order to use prefix.selector, template options must be supplied.', () => {

        var configNoPrefixedAssets = {
            dest: './test/sugarcoat',
            template: {
                selectorPrefix: 'blah'
            },
            include: {
                css: [
                    './test/assert/*.css'
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

        sugarcoat( configNoPrefixedAssets )
        .then( data => {

            assert.instanceOf( data, Error, 'Sugarcoat should be erroring out when prefix.assets is not supplied.');

        }, data => {

            assert.instanceOf( data, Error, 'The object was an Error Object.' );

            assert.propertyVal( data, 'message', errors.configTemplateOptionsMissing, 'Sugarcoat gave us the correct error.' );
        });
    });

    teardown( done => {

        fs.remove( './test/sugarcoat', err => {

            if ( err ) return console.error( err );

            done();
        });
    });
});

suite( 'Configure: Sections', function () {

    test( 'Sections.title is set to be required. Sections.title errored out when sections.title is the only required option that was not supplied.', () => {

        var configMissingOnlyTitle = {
            dest: './test/sugarcoat',
            sections: [
                {
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        sugarcoat( configMissingOnlyTitle )
        .then( data => {

            assert.instanceOf( data, Error, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.instanceOf( data, Error, 'The object was an Error Object.' );

            assert.propertyVal( data, 'message', errors.configSectionTitleMissing, 'Sugarcoat gave us the correct error.' );
        });
    });

    test( 'Section array is set to be required. Section array errored out when not supplied.', () => {

        var configMissingTitleFiles = {
            dest: './test/sugarcoat'
        };

        sugarcoat( configMissingTitleFiles )
        .then( data => {

            assert.instanceOf( data, Error, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.instanceOf( data, Error, 'The object was an Error Object.' );

            assert.propertyVal( data, 'message', errors.configSectionArrayMissing, 'Sugarcoat gave us the correct error.' );
        });
    });

    test( 'Section objects are set to be required. Section array errored out when section object(s) were not supplied.', () => {

        var configMissingTitleFiles = {
            dest: './test/sugarcoat',
            sections: []
        };

        sugarcoat( configMissingTitleFiles )
        .then( data => {

            assert.instanceOf( data, Error, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.instanceOf( data, Error, 'The object was an Error Object.' );

            assert.propertyVal( data, 'message', errors.configSectionObjectMissing, 'Sugarcoat gave us the correct error.' );
        });
    });

    test( 'Section.files is set to be required. Section.files errored out when it was not supplied for one section object.', () => {

        var configMissingOneFiles = {
            dest: './test/sugarcoat',
            sections: [
                {
                    title: 'CSS File'
                }
            ]
        };

        sugarcoat( configMissingOneFiles )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.instanceOf( data, Error, 'The object was an Error Object.' );

            assert.propertyVal( data, 'message', errors.configSectionFileMissing, 'Sugarcoat gave us the correct error.' );
        });
    });

    teardown( done => {

        fs.remove( './test/sugarcoat', err => {

            if ( err ) return console.error( err );

            done();
        });
    });
});