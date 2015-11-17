var util = require( 'util' );
var path = require( 'path' );

var _ = require( 'lodash' );

var log = require( '../../lib/logger' );

/**
 * Default configuration values
 */
var defaults = {};

defaults.settings = {};
defaults.settings.cwd = process.cwd();
defaults.settings.dest = null;

defaults.settings.template = {};
defaults.settings.template.cwd = path.join( __dirname, 'templates' );
defaults.settings.template.layout = path.join( defaults.settings.template.cwd, 'main.hbs' );
defaults.settings.template.partials = [ path.join( defaults.settings.template.cwd, 'partials' ) ];
defaults.settings.template.assets = [
    'js',
    'styles',
    'images'
];

/**
 *
 */
function init( options ) {

    var defaultsCopy = _.cloneDeep( defaults )
        , config = _.merge( defaultsCopy, options )
        , settings = config.settings
        , template = settings.template
        ;

    log.config( options.settings.log );

    // Remove the default assets
    if ( _.has( options, 'settings.template.assets' ) ) {

        template.assets = _.difference( template.assets, defaults.settings.template.assets );
    }

    // Resolve `dest` path if provided
    if ( settings.dest ) {
        settings.dest = path.resolve( settings.cwd, settings.dest );
    }

    // Concat the default partials directory into config
    template.partials = _.union( template.partials, defaults.settings.template.partials );

    template.layout = path.resolve( template.cwd, template.layout );

    template.partials = template.partials.map( function ( dir ) {
        return path.resolve( template.cwd, dir );
    });

    template.assets = template.assets.map( function ( dir ) {
        return path.resolve( template.cwd, dir );
    });

    return config;
}

module.exports = module.exports.init = init;
module.exports.defaults = defaults;
