var fs = require( 'fs' );
var path = require( 'path' );

var parser = require( './parser' );
var render = require( './render' );
var log = require( '../../lib/logger' );
var configure = require( './configure' );
var globber = require( '../../lib/globber' );

/**
 *
 */
module.exports = init;

function init( config ) {

    config = configure( config );

    if ( config.error ) {

        log.error( config.error );

        return Promise.reject();
    }

    // if ( config.settings.dest === null ) {

    //     // Don't render
    //     return globFiles( config )
    //     .then( readSections )
    //     .then( parseSections )
    //     .then( function ( html ) {

    //         log.info( 'Finished!' );

    //         return html;
    //     })
    //     .catch( function ( err ) {
    //         log.error( err );
    //     });
    // }
    // else {

    //     return globFiles( config )
    //     .then( readSections )
    //     .then( parseSections )
    //     .then( render )
    //     .then( function ( html ) {

    //         log.info( 'Finished!' );

    //         return html;
    //     })
    //     .catch( function ( err ) {
    //         log.error( err );
    //     });
    // }

    return globFiles( config )
    .then( readSections )
    .then( parseSections )
    .then( renderOnDest )
    .then( function ( html ) {

        log.info( 'Finished!' );

        return html;
    })
    .catch( function ( err ) {
        log.error( err );
    });
}

function globFiles( config ) {

    var globArr = config.sections.map( function ( section ) {

        return globber( section.files );
    });

    return Promise.all( globArr )
    .then( function ( sections ) {

        sections.forEach( function ( section, index ) {

            config.sections[ index ].files = section;
        });

        return config;
    });
}

function readSections( config ) {

    var promiseArr = config.sections.map( function ( section ) {

        return Promise.all( section.files.map( function ( file, index ) {

            return new Promise( function ( resolve, reject ) {

                fs.readFile( file, 'utf8', function ( err, src ) {

                    if ( err ) return reject( err );

                    section.files[ index ] = {
                        path: file,
                        ext: path.parse( file ).ext.substring( 1 ),
                        src: src
                    };

                    resolve( section.files[ index ] );
                });
            });
        }));
    });

    return Promise.all( promiseArr )
    .then( function () {
        return config;
    });
}

function parseSections( config ) {

    var parse = parser( config );

    config.sections.forEach( function ( section ) {

        section.files.map( function ( file, index ) {

            section.files[ index ].data = parse.parseComment( file.path, file.src, section.type, section.template );
        });
    });

    return config;
}

function renderOnDest( config ) {

    if ( config.settings.dest !== null ) {

        console.log('test');
        render( config );

    }
    else {

        return config;
    }
}