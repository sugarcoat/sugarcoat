#!/usr/bin/env node

/**
 * Command line interface for Sugarcoat.
 */
!function () {

    var fs = require( 'fs' );
    var path = require( 'path' );
    var program = require( 'commander' );
    var pkg = require( '../../../package.json' );
    var patternLib = require( '../index' );

    program
        .usage( '[options] <configuration file>' )
        .option( '--json', 'Return JSON' )
        .description( pkg.description )
        .version( pkg.version )
        .parse( process.argv );

    if ( !program.args.length ) {

        return program.help();
    }

    var config = require( path.join( process.cwd(),program.args[0] ) )

    if ( program.json ) {

        return patternLib( config, { logLevel: 'silent' } ).then( function ( data ) {

            process.stdout.write( JSON.stringify( data ) );
        });
    }

    return patternLib( config, {} );
}();