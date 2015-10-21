/**
 * 
 * Utility Functions
 *
 */

var mkdirp = require( 'mkdirp' )
    , getDirName = require( 'path' ).dirname
    , fs = require( 'fs' )
    ;

function Utils() {};

Utils.prototype = {
// creates directories to path name provided if directory doesn't exist, otherwise is a noop.
    writeFile: function( path, contents, cb ) {
    
        mkdirp(getDirName(path), function (err) {
            if (err) return cb(err)
            fs.writeFile(path, contents, cb)
      });
    },
// replaces string to camelCase string
    toCamelCase: function( str ) {
    
        var str = str.replace( /\w\S*/g,
            function( txt ){
            
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }).replace( /\s+/g, '');

        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    
};

module.exports = new Utils;