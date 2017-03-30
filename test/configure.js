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

            assert.isArray( data, 'Sugarcoat should be erroring out when a dest is not supplied.');
            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array when we are missing a dest.' );

            data.forEach( ( errorObj, index ) => {

                assert.instanceOf( errorObj, Error, 'The object was an Error Object.' );
            });

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

            var index = data.settings.dest !== null ? path.resolve( data.settings.cwd, `${data.settings.dest}/index.html` ) : `${data.settings.cwd}/index.html`;

            fs.access( index, fs.constants.F_OK, ( err ) => {
                var exists;

                if ( !err ) {
                    exists = true;
                }
                else exists = false;

                assert.isFalse( exists, 'Sugarcoat did not create a index.html file.' );
                done();
            });
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

    test( 'Sections.title is set to be required. Sections.title errored out when sections.title is the only required option that was not supplied.', done => {

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
            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            data.forEach( ( errorObj, index ) => {

                assert.instanceOf( errorObj, Error, 'The object was an Error Object.' );
            });

            done();
        });
    });

    test( 'Sections.title is set to be required. Sections.title errored out when title and dest were not supplied.', done => {

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
            done();
        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            data.forEach( ( errorObj, index ) => {

                assert.instanceOf( errorObj, Error, 'The object was an Error Object.' );
            });

            done();
        });
    });

    test( 'Section array is set to be required. Section array errored out when not supplied.', done => {

        var configMissingTitleFiles = {
            settings: {
                dest: './test/documentation'
            }
        };

        sugarcoat( configMissingTitleFiles )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

            done();

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            data.forEach( ( errorObj, index ) => {

                assert.instanceOf( errorObj, Error, 'The object was an Error Object.' );
            });

            done();
        });
    });

    test( 'Section objects are set to be required. Section array errored out when section object(s) were not supplied.', done => {

        var configMissingTitleFiles = {
            settings: {
                dest: './test/documentation'
            },
            sections: []
        };

        sugarcoat( configMissingTitleFiles )
        .then( data => {

            assert.isArray( data, 'Sugarcoat should be erroring out.' );

            done();

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            data.forEach( ( errorObj, index ) => {

                assert.instanceOf( errorObj, Error, 'The object was an Error Object.' );
            });

            done();
        });
    });

    test( 'Section.title is set to be required. Section.title errored out multiple times when more than one section.title was not supplied.', done => {

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

            done();

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array.' );

            data.forEach( ( errorObj, index ) => {

                assert.instanceOf( errorObj, Error, 'The object was an Error Object.' );
            });

            done();
        });
    });

    test( 'Section.files is set to be required. Section.files errored out when it was not supplied for one section object.', done => {

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

            done();

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array when missing a dest.' );

            data.forEach( ( errorObj, index ) => {

                assert.instanceOf( errorObj, Error, 'The object was an Error Object.' );
            });

            done();
        });
    });

    test( 'Section.files is set to be required. Section.files errored out when it was not supplied for two or more section objects.', done => {

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

            done();

        }, data => {

            assert.isArray( data, 'Sugarcoat returns an array when missing a dest.' );

            assert.notEqual( configMissingTwoFiles.sections[0].title, configMissingTwoFiles.sections[1].title, 'We have two different objects.' );

            data.forEach( ( errorObj, index ) => {

                assert.instanceOf( errorObj, Error, 'The object was an Error Object.' );
            });

            done();
        });
    });
});