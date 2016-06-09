var sugarcoat = require( '../index.js' );

var config = require( './documentation/config.js' );

sugarcoat( config ).then( function( data ) {
    console.log('finished!');
});