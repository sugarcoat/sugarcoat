'use strict';

var assert = require( 'chai' ).assert;
var fs = require( 'fs-extra' );
var path = require( 'path' );

var sugarcoat = require( '../lib/index' );

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

            assert.isArray( data, 'Sugarcoat should be erroring out when a dest is not supplied.');

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array when we are missing a dest.' );
            assert.propertyVal( data[0], 'key', 'settings.dest', 'We have dest in the error array');

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

    teardown( done => {

        fs.remove( './sugarcoat', err => {

            if ( err ) return err;

            done();
        });

    });
});

suite( 'Configure: Sections', function () {

    test( 'Sections.title is set to be required. Sections.title errored out when sections.title is the only required option that was not supplied.', () => {

        var configMissingOnlyTitle = {
            settings: {
                dest: './test/documentation'
            },
            sections: [
                {
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        sugarcoat( configMissingOnlyTitle )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            if ( data.length === 1 ) {

                assert.propertyVal( data[0], 'key', 'sections.title', 'We have sections.title in the error array.' );
            }
        });
    });

    test( 'Sections.title is set to be required. Sections.title errored out when title and dest were not supplied.', () => {

        var configMissingTitleDest = {
            sections: [
                {
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        sugarcoat( configMissingTitleDest )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections.title' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections.title', 'We have sections.title in the error array.' );
                    break;
                }
            }
        });
    });

    test( 'Section array is set to be required. Section array errored out when not supplied.', () => {

        var configMissingTitleFiles = {
            settings: {
                dest: './test/documentation'
            }
        };

        sugarcoat( configMissingTitleFiles )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections', 'A section array of one or more objects is required. Please add a section object to the sections array.' );
                    break;
                }
            }
        });
    });

    test( 'Section objects are set to be required. Section array errored out when section object(s) were not supplied.', () => {

        var configMissingTitleFiles = {
            settings: {
                dest: './test/documentation'
            },
            sections: []
        };

        sugarcoat( configMissingTitleFiles )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections', 'Section objects are required in the sections array. Please add a section object to the section array.' );
                    break;
                }
            }
        });
    });

    test( 'Section.title is set to be required. Section.title errored out multiple times when more than one section.title was not supplied.', () => {

        var configMissingtwoTitles = {
            settings: {
                dest: './test/documentation'
            },
            sections: [
                {
                    files: './test/assert/parseVarCode.css'
                },
                {
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        sugarcoat( configMissingtwoTitles )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections.files' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections.title', 'We have sections.title in the error array.' );
                }
            }
        });
    });

    test( 'Section.files is set to be required. Section.files errored out when it was not supplied for one section object.', () => {

        var configMissingOneFiles = {
            settings: {
                dest: './test/documentation'
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

            assert.isArray( data, 'Sugarcoat returns an array when missing a dest.' );
            assert.propertyVal( data[0], 'key', 'sections.files', 'We have sections.files in the error array' );
        });
    });

    test( 'Section.files is set to be required. Section.files errored out when it was not supplied for two or more section objects.', () => {

        var configMissingTwoFiles = {
            settings: {
                dest: './test/documentation'
            },
            sections: [
                {
                    title: 'CSS File'
                },
                {
                    title: 'CSS File 2'
                }
            ]
        };

        sugarcoat( configMissingTwoFiles )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array when missing a dest.' );

            assert.notEqual( configMissingTwoFiles.sections[0].title, configMissingTwoFiles.sections[1].title, 'we have two different objects.' );

            for ( var errorObj in data.sections ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections.files' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections.files', 'We have sections.title in the error array.' );
                }
            }
        });
    });
});