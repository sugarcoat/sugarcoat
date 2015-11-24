var util = require( 'util' );

var _ = require( 'lodash' );
var glob = require( 'glob' );
var log = require( 'npmlog' );

function Globber( files ) {

    this.toNegate = true;
    this.options = {};
    this.negationsArray = [];

    var toGlob = [];

    if ( typeof files === 'object' && files.options ) {

        this.options = files.options;

        if ( Array.isArray( files.src ) ) {

            toGlob = files.src;
        }
        else {
            toGlob.push( files.src );
        }

    }
    else if ( typeof files === 'string' ) {

        toGlob.push( files );
        this.toNegate = false;

    }
    else {

        toGlob = files;
    }

    var globArrays = toGlob.map( this.globArrays.bind( this ) );

    return Promise.all( globArrays )
    .then( function( values ) {

        return _.flatten( values );

    })
    .catch( function ( err ) {
        log.error( err );
    });
}

Globber.prototype = {

    globArrays: function( globPath ) {

        var self = this;

        return new Promise( function( resolve, reject ) {

            var isNegation = globPath.indexOf( '!' ) > -1;

            if ( self.toNegate && isNegation ) {

                var negatedPath = globPath.replace( '!', '' );

                self.negationsArray = self.negationsArray.concat( negatedPath );
            }

            glob( globPath, self.options, function( err, globbed ) {

                if ( err ) return reject( err );

                if ( globbed.length < 1 && globbed !== 'undefined' && !isNegation ) {

                    log.warn( 'Empty glob from:', globPath );
                }

                return resolve( _.difference( globbed, self.negationsArray ) );
            });
        });
    }
};

module.exports = function( options ) {
    return new Globber( options );
};