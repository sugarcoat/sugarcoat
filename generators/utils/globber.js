var util = require( 'util' )
    , glob = require( 'glob' )
    , _ = require( 'lodash' )
    , log = require( 'npmlog' )
    ;

function Globber( files ) {
    
    this.toNegate = true;
    this.options = {};
    
    var toGlob = [];
    
    if ( typeof files === 'object' && files.options ) {
        
        this.options = files.options;
        toGlob = files.src;
    }
    else if ( typeof files === 'string' ) {
        
        toGlob[ 0 ] = files;
        this.toNegate = false;
    }
    else {
        
        toGlob = files;
    }
    
    var globArrays = toGlob.map( this.globArrays.bind( this ) );
    
    return Promise.all( globArrays )
    
        .then( function( values ){
            
            var results = [];
            
            values.forEach( function( value ) {
                
                results = results.concat( value );
            });
            
            return results;
        });

    // return this.passFiles( files );
}

Globber.prototype = {
    
    globArrays: function( globPath ) {
        
        var self = this;

        return new Promise( function( resolve, reject ) {

            var isNegation = globPath.indexOf( '!' ) > -1
                , negationsArray = [];
            
            // console.log( isNegation );

            if ( self.toNegate && isNegation ) {
    
                negationsArray = negationsArray.concat( globPath.replace( '!', '' ) );
            }            

            glob( globPath, self.options, 
                function( err, globbed ) {
                        
                    if ( err ) {
        
                        log.error( 'Glob Error', err );
                    }
    
                    if ( globbed.length < 1 && globbed !== 'undefined' && !isNegation) {

                        log.warn( 'Empty glob from file:', globPath );
                    }
    
                    var returnThis = _.difference( globbed, negationsArray );
    
                    resolve( returnThis );
                }
            );
        });
    }
};

module.exports = function( options ) {
    return new Globber( options );
};