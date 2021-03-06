'use strict';

var path = require( 'path' );

var parser = require( './parser' );
var render = require( './render' );
var configure = require( './configure' );
var globber = require( './globber' );
// var log = require( './logger' );
var fsp = require( './fs-promiser' );

/**
 *
 */
module.exports = init;

function init( config ) {

    config = configure( config );

    if ( config instanceof Error ) {

        return new Promise( ( resolve, reject ) => {

            return reject( config );
        });
    }

    return globFiles( config )
    .then( readSections )
    .then( parseSections )
    .then( render )
    .then( config => {

        // TODO: find another way to display this to the user
        // log.info( 'Finished!' );

        return config;
    })
    .catch( err => Promise.reject( err ) );
}

function globFiles( config ) {

    var globArr = config.sections.map( section => {

        return globber( section.files );
    });

    return Promise.all( globArr )
    .then( sections => {

        sections.forEach( ( section, index ) => {

            config.sections[ index ].files = section;
        });

        return config;
    });
}

function readSections( config ) {

    var promiseArr = config.sections.map( section => {

        return Promise.all( section.files.map( file => {
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
    .then( () => {
        return config;
    });
}

function parseSections( config ) {

    var error
        , parse = parser( config );


    var isError = config.sections.some( section => {

        section.files.map( ( file, index ) => {

            section.files[ index ].data = parse.parseComment( file.path, file.src, section.mode, section.template );

            if ( section.files[ index ].data instanceof Error ) {

                return error = section.files[index].data;
            }

        });

        return error instanceof Error;
    });

    if ( isError ) return Promise.reject( error );
    else return config;
}
