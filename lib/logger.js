var _ = require( 'lodash' );
var log = require( 'npmlog' );

var defaults = {
    prefixStyle: {
        fg: 'yellow'
    }
};

/**
 * Allow configuring
 */
function config( options ) {

    options = _.assign( {}, defaults, options );
    _.assign( log, options );

    return log;
};

module.exports = config();
module.exports.config = config;