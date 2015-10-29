/**
 * 
 * Utility Functions
 *
 */

var fs = require( 'fs' )
    , mkdirp = require( 'mkdirp' )
    , getDirName = require( 'path' ).dirname
    ;

var Utils = {
// creates directories to path name provided if directory doesn't exist, otherwise is a noop.
    writeFile: function( path, contents, callback ) {
    
        mkdirp( getDirName( path ), function ( err ) {
            
            if ( err ) { return callback( err ); }
                
            fs.writeFile( path, contents, callback )
      });
    },
// replaces string to camelCase string
    toCamelCase: function( str ) {
    
        var str = str.replace( /\w\S*/g, function( txt ) {
            
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();

            }).replace( /\s+/g, '');

        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    
};

module.exports = Utils;