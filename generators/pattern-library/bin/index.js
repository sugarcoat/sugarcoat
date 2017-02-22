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

    // If we run with --json flag, we need to stop sugarcoat from creating an HTML file

    patternLib( config ).then( function ( data ) {

        if ( program.json ) {

            data = JSON.stringify( data );
            process.stdout.write( data );
        }
    });
}