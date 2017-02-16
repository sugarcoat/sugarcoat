var _ = require( 'lodash' );
var log = require( 'npmlog' );

var defaults = {
    prefixStyle: {
        fg: 'yellow'
    }
};

/**
 * Allow configuring
 * @param {string|object} options The options that are passed to the logger.
 * @returns {string} Errors that need to be logged.
 */
function config( options ) {

    options = _.assign( {}, defaults, options );
    _.assign( log, options );

    return log;
}

module.exports = config();
module.exports.config = config;