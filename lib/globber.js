var util = require( 'util' );
var _ = require( 'lodash' );
var log = require( 'npmlog' );
var globby = require( 'globby' );

/**
 * Enables various ways to provide file patterns.
 *
 * @example
 *  globber( 'my/pattern/*' );
 *
 * @example
 *  globber( [
 *      'my/first/pattern/*,
 *      'my/second/pattern/*
 *  ]);
 *
 * @example
 *  globber({
 *      src: String/Array,
 *      options: Object
 *  });
 *
 * @example
 *  globber([
 *      {
 *          src: String/Array,
 *          options: Object
 *      },
 *      {...}
 *  ]);
 *
 * @param pattern {String|Array|Object} The patterns to match.
 */
module.exports = function( pattern ) {

    var result;

    // String
    if ( _.isString( pattern ) ) {

        result = globby( pattern );

    }
    // Object
    else if ( _.isPlainObject( pattern ) ) {

        result = globby( pattern.src, pattern.options );

    }
    // Array
    else {

        // Array of Strings
        if ( _.isString( pattern[0] ) ) {

            result = globby( pattern );

        }
        // Array of Objects
        else {

            result = Promise.all( pattern.map( function ( obj ) {

                return globby( obj.src, obj.options );
            }))
            .then( _.flatten );
        }
    }

    return result.catch( function ( err ) {
        log.error( 'Globber', err );
    });
};