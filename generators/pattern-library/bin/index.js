#!/usr/bin/env node

/**
 * Command line interface for Sugarcoat.
 */
var util = require( 'util' );
var path = require( 'path' );
var program = require( 'commander' );
var pkg = require( '../../../package.json' );
var patternLib = require( '../index' );

program
    .usage( '[flags] <configuration file>' )
    .option( '-o --output', 'Write output to process.stdout' )
    .description( pkg.description )
    .version( pkg.version )
    .parse( process.argv );

if ( !program.args.length ) {

    program.help();
}
else {

    var config = require( path.join( process.cwd(), program.args[0] ) );

    patternLib( config ).then( function ( data ) {

        if ( program.output && config.settings.format ) process.stdout.write( data );
    });
}