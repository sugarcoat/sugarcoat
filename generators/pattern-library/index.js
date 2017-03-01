var path = require( 'path' );

var parser = require( './parser' );
var render = require( './render' );
var configure = require( './configure' );
var templater = require( './templater' );
var globber = require( '../../lib/globber' );
var log = require( '../../lib/logger' );
var fsp = require( '../../lib/fs-promiser' );

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

    return globFiles( config )
    .then( readSections )
    .then( parseSections )
    .then( templater )
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

        return Promise.all( section.files.map( function ( file ) {
            return fsp.readFile( file );
        }))
        .then( ( resolvedSections ) => {
            return section.files.map( ( file, index ) => {
                section.files[ index ] = {
                    path: file,
                    ext: path.parse( file ).ext.substring( 1 ),
                    src: resolvedSections[ index ]
                };
            });
        });
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
        return render( config );

    }
    else {

        return config;
    }
}
