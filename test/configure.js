var assert = require( 'chai' ).assert;
var fs = require( 'fs-extra' );
var path = require( 'path' );

var sugarcoat = require( '../index' );

suite( 'Configure: Settings', () => {

    test( 'Destination is set to be required. Destination errored out when not supplied.', (done) => {

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

            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );
            assert.propertyVal( data[0], 'key', 'settings.dest', 'We have dest in the error array');
            done();
        });

    });

    test( 'Destination can be set to none. No index file is created.', done => {

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

            assert.isNull( data.settings.dest, 'The destination was set to null' );
            assert.isFalse( fs.existsSync( path.relative( data.settings.cwd, 'index.html' ) ), 'Sugarcoat did not create a index.html file.' );
            done();
        });
    });

    teardown( done => {

        fs.remove( './sugarcoat', err => {

            if ( err ) return console.error( err );

            done();
        });

    });
});

suite( 'Configure: Sections', () => {

    test( 'Title is set to be required. Title errored out when title is the only required option that was not supplied.', done => {

        var configMissingOnlyTitle = {
            settings: {
                dest: './test/documentation',
                title: 'Pattern Library'
            },
            sections: [
                {
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        sugarcoat( configMissingOnlyTitle )
        .then( data => {

            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            if ( data.length === 1 ) {

                assert.propertyVal( data[0], 'key', 'sections.title', 'We have sections.title in the error array.' );
            }

            done();
        });
    });

    test( 'Title is set to be required. Title errored out when title and dest were not supplied.', done => {

        var configMissingTitleDest = {
            sections: [
                {
                    files: './test/assert/parseVarCode.css'
                }
            ]
        };

        sugarcoat( configMissingTitleDest )
        .then( data => {

            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections.title' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections.title', 'We have sections.title in the error array.' );
                    break;
                }
            }

            done();
        });
    });

    test( 'Title is set to be required. Title errored out when all required options were not supplied.', done => {

        var configMissingTitleFiles = {
            sections: []
        };

        sugarcoat( configMissingTitleFiles )
        .then( data => {

            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections.title' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections.title', 'We have sections.title in the error array.' );
                    break;
                }
            }

            done();
        });
    });

    test( 'Title is set to be required. Title errored out multiple times when more than one files was not supplied.', done => {

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

            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections.files' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections.title', 'We have sections.title in the error array.' );
                }
            }

            done();
        });
    });

    test( 'Files is set to be required. Files errored out when it was not supplied for one section object.', done => {

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

            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array when missing a dest.' );
            assert.propertyVal( data[0], 'key', 'sections.files', 'We have sections.files in the error array' );
            done();
        });
    });

    test( 'Files is set to be required. Files errored out when it was not supplied for two or more section objects.', done => {

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

            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array when missing a dest.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections.files' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections.files', 'We have sections.title in the error array.' );
                }
            }

            done();
        });
    });

    test( 'Files is set to be required. Files errored out when all required options were not supplied.', done => {

        var configMissingTitleFiles = {
            sections: []
        };

        sugarcoat( configMissingTitleFiles )
        .then( data => {

            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            for ( var errorObj in data ) {

                var key = data[ errorObj ].key;

                if ( key === 'sections.files' ) {

                    assert.propertyVal( data[ errorObj ], 'key', 'sections.files', 'We have sections.files in the error array.' );
                    break;
                }
            }

            done();
        });
    });
});