'use strict';

var assert = require( 'chai' ).assert;
var fs = require( 'fs-extra' );
var path = require( 'path' );

var sugarcoat = require( '../lib/index' );
var errors = require( '../lib/errors' );

suite( 'Configure: Settings', function () {

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

    test( 'When destination is set to none, no index file is created.', () => {

        var configNoDest = {
            settings: {
                dest: 'none'
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

        sugarcoat( configNoDest )
        .then( data => {

            var index = data.settings.dest !== null ? path.resolve( data.settings.cwd, `${data.settings.dest}/index.html` ) : `${data.settings.cwd}/index.html`;

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

    test( 'In order to use prefix.selector, prefix.assets must be supplied.', () => {

        var configNoPrefixedAssets = {
            settings: {
                dest: './test/sugarcoat',
                prefix: {
                    selector: 'blah'
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
            settings: {
                dest: './test/sugarcoat',
                prefix: {
                    selector: 'blah',
                    assets: [
                        './test/assert/*.css'
                    ]
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
            settings: {
                dest: './test/sugarcoat'
            },
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
            settings: {
                dest: './test/sugarcoat'
            }
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
            settings: {
                dest: './test/sugarcoat'
            },
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
            settings: {
                dest: './test/sugarcoat'
            },
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