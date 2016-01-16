var util = require( 'util' );
var path = require( 'path' );

var _ = require( 'lodash' );

var log = require( '../../lib/logger' );

/**
 * Default configuration values
 */
var defaults = {};
var defaultAssets = 'sugarcoat';
var cwdTemplates = path.join( __dirname, 'templates' );

defaults.settings = {};
defaults.settings.cwd = process.cwd();
defaults.settings.dest = null;
defaults.settings.format = null;

defaults.settings.template = {};
defaults.settings.template.cwd = process.cwd();
defaults.settings.template.layout = path.join( cwdTemplates, 'main.hbs' );
defaults.settings.template.assets = [];
defaults.settings.template.partials = [
    path.join( cwdTemplates, 'partials' )
];

/**
 *
 */
function init( options ) {

    // set patrials to always be an array before merging with defaults
    if ( !_.isArray(options.settings.template.partials)){
        options.settings.template.partials = [ options.settings.template.partials ];
    }

    var defaultsCopy = _.cloneDeep( defaults )
        , config = _.merge( defaultsCopy, options )
        , settings = config.settings
        , template = settings.template
        , shouldGetDefaultAssets = _.isEmpty( template.assets ) || _.includes( template.assets, defaultAssets )
        , partialSrc
        , partialOpt
        ;

    // Configure the logger
    log.config( options.settings.log );

    // Remove `defaultAssets` keyword, if present
    _.pull( template.assets, defaultAssets );

    // Convert to a file object
    template.assets = template.assets.map( function ( dirPath ) {

        return {
            cwd: template.cwd,
            dir: path.resolve( template.cwd, dirPath )
        }
    });

    // Add in the default assets
    if ( shouldGetDefaultAssets ) {

        template.assets.push({
            cwd: cwdTemplates,
            dir: path.resolve( cwdTemplates, defaultAssets )
        });
    }

    // Add the default partials onto the beginning of the array, and get the unique values ??doesnt work
    // template.partials = _.uniq( defaults.settings.template.partials.concat( template.partials ) );

    //add default partials onto the beginning of the array
    template.partials = template.partials.concat( defaults.settings.template.partials );
    
    // Resolve all paths
    template.layout = path.resolve( template.cwd, template.layout );

    //when we map out the partials array we need to break out the source and options 
    //so we can use them when we glob each object in the array
    template.partials = template.partials.map( function ( dir ) {
        partialSrc = path.resolve( template.cwd, (dir.src)? dir.src : dir );
        partialOpt = (dir.options)? dir.options : { nodir: true };

        return {
            src: partialSrc,
            options: partialOpt
        };
    });

    if ( settings.dest ) {
        settings.dest = path.resolve( settings.cwd, settings.dest );
    }

    config.sections.forEach( function ( section ) {
        
        if ( !section.template ) {
            section.template = `section-${ section.type || 'default' }`;
        }
    });

    return config;
}

module.exports = module.exports.init = init;
module.exports.defaults = defaults;
