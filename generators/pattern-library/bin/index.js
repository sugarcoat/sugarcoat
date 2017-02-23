#!/usr/bin/env node

/**
 * Command line interface for Sugarcoat.
 */
var path = require( 'path' );
var program = require( 'commander' );
var pkg = require( '../../../package.json' );
var patternLib = require( '../index' );

program
    .usage( '[flags] <configuration file>' )
    .option( '--json', 'Convert html to JSON and write to process.stdout' )
    .description( pkg.description )
    .version( pkg.version )
    .parse( process.argv );

if ( !program.args.length ) {

    program.help();
}
else {

    var config = require( path.join( process.cwd(), program.args[0] ) );
    var json = false;

    if ( program.json ) json = true;

    patternLib( config, json ).then( function ( data ) {

        if ( json ) {

            data = JSON.stringify( data );
            process.stdout.write( data );
        }
    });
}