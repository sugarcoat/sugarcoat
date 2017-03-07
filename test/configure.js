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

            assert.isArray( data, 'data is an array' );
            assert.propertyVal( data[0], 'key', 'settings.dest', 'We have dest in the array');
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
});