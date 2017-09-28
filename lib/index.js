'use strict';

var path = require( 'path' );
var util = require( 'util' );

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

/**
 * Glob Files
 * Matches all files that meet the file patterns of (globs) all file paths given in the config
 * @param  {Object} config The expanded config file that was created from configure.js
 * @returns {Object}        A more expanded config file, that gives us all of the file paths from any patterns within section.files
 */
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

/**
 * Read Sections
 * Reads each file within section.files and adds that file's source code as section.files.src
 * @param  {Object} config Expanded config
 * @returns {Object}        A more expanded config that includes the section.files source code
 */
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
        // console.log('after readSections');
        // console.log(util.inspect( config, { depth: 7, colors: true } ) );

        return config;
    });

    // TODO: add catch that will handle if readFile errors
}

/**
 * Parse Sections
 * Parses each comment block within the source code of each file and creates section.files.data, which breaks down the comment block and it's section using comment serializer
 * @param  {Object} config Expanded config
 * @returns {Object}        A more expanded config
 */
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
    else {
        console.log('after parseSections');
        console.log(util.inspect( config, { depth: 7, colors: true } ) );

        return config;
    }
}
