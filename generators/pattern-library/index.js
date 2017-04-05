'use strict';

var path = require( 'path' );

var parser = require( './parser' );
var render = require( './render' );
var configure = require( './configure' );
var globber = require( '../../lib/globber' );
var log = require( '../../lib/logger' );
var fsp = require( '../../lib/fs-promiser' );

/**
 *
 */
module.exports = init;

function init( config ) {

    // First, add errors array to config
    config.errors = [];

    config = configure( config );

    // If we have errors in the array, reject and handoff those errors to the user
    if ( config.errors.length ) {

        return new Promise( ( resolve, reject ) => {

            reject( config.errors );
        });
    }

    return globFiles( config )
    .then( readSections )
    .then( parseSections )
    .then( render )
    .then( config => {

        // console.log('html', html);
        log.info( 'Finished!' );

        return config;
    })
    .catch( err => {
        log.error( err );
    });
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

    var parse = parser( config );

    config.sections.forEach( section => {

        section.files.map( ( file, index ) => {

            section.files[ index ].data = parse.parseComment( file.path, file.src, section.mode, section.template );
        });
    });

    return config;
}
