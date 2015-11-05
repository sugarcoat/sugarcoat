/**
 *
 *
 *
 *
 *
 */

var util = require( 'util' )
var fs = require( 'fs' );
var log = require( 'npmlog' );

var globber = require( '../../lib/globber' );
var parser = require( './parser' );
var render = require( './render' );

function generate( config, options ) {

    log.level = options.logLevel || 'info';

    return globFiles( config )
        .then( readSections )
        .then( parseSections )
        .then( render );
}

/**
 *
 */
function globFiles( options ) {

    var globArr = options.sections.map( function( section ) {

        return globber( section.files );

    });

    return Promise.all( globArr ).then( function ( sections ) {

        sections.forEach( function( section, index ) {

            options.sections[ index ].files = section;
        });

        return options;
    });
}

/**
 *
 */
function readSections( options ) {

    var promiseArr = options.sections.map( function ( section, index ) {

        return Promise.all( section.files.map( function ( file, index ) {

            return new Promise( function ( resolve, reject ) {

                fs.readFile( file, 'utf8', function( err, src ) {

                    if ( err ) return reject( err );

                    section.files[ index ] = {
                        path: file,
                        src: src
                    }

                    resolve( section.files[ index ] );
                });
            });
        }));
    });

    return Promise.all( promiseArr ).then( function ( values ) {
        return options;
    });
}

/**
 *
 */
function parseSections( options ) {

    var parse = parser();

    options.sections.forEach( function ( section, index ) {

        section.files.map( function ( file, index ) {

            section.files[ index ].data = parse.parseComment( file.path, file.src, section.type, section.template );
        });
    });

    return options;
}

module.exports = generate;