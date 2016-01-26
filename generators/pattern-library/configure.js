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
var defaultPartials = path.join( cwdTemplates, 'partials' );

defaults.settings = {};
defaults.settings.cwd = process.cwd();
defaults.settings.dest = null;
defaults.settings.format = null;

defaults.settings.template = {};
defaults.settings.template.cwd = process.cwd();
defaults.settings.template.layout = path.join( cwdTemplates, 'main.hbs' );
// defaults.settings.template.assets = [];
// defaults.settings.template.partials = [
//     path.join( cwdTemplates, 'partials' )
// ];

/**
 *
 */
function init( options ) {

    var defaultsCopy = _.cloneDeep( defaults )
        , config = _.merge( defaultsCopy, options )
        , settings = config.settings
        , template = settings.template
        ;


    // Check if "sugarcoat" is in assets property
    var shouldGetDefaultAssets = _.isEmpty( template.assets )
        || _.includes( template.assets, defaultAssets )
        || _.some( template.assets, [ 'src', defaultAssets ] );





    // Configure the logger
    log.config( options.settings.log );

    // **** ASSETS ****

    // Set Assets to an array
    if ( !_.isArray( template.assets ) ) {

        template.assets = [ template.assets ];
    }

    // Add in the default assets
    if ( shouldGetDefaultAssets ) {

        // Get the sugarcoat string out of the array
        _.pull( template.assets, defaultAssets );

        template.assets.push( path.resolve( cwdTemplates, defaultAssets ) );
    }

    // Convert remaining array pieces into a file object
    template.assets = template.assets.map( function ( dirPath ) {

        return normalizeDirectory( dirPath, cwdTemplates );
    });


    // **** LAYOUT ****

    // Resolve all paths
    template.layout = path.resolve( template.cwd, template.layout );


    // **** PARTIALS ****

    template.partials = template.partials || [];

    // If partials is empty or falsy, then set our defaults
    if( _.isArray( template.partials ) ) {

        // console.log('this is an array');
        //normalize the contents of the array
        template.partials = template.partials.map( function ( dirPath ) {

            return normalizeDirectory( dirPath, template.cwd );
        });
    }
    else {

        // console.log('not empty or array');
        //use new function on it
        template.partials = [ normalizeDirectory( template.partials, template.cwd ) ];
    }

    //then add defaults on
    template.partials.unshift( normalizeDirectory( defaultPartials, template.cwd ) );


    // **** SETTINGS ****

    if ( settings.dest ) {
        settings.dest = path.resolve( settings.cwd, settings.dest );
    }

    // **** SECTIONS ****

    config.sections.forEach( function ( section ) {

        if ( !section.template ) {
            section.template = `section-${ section.type || 'default' }`;
        }
    });

    return config;
}

function normalizeDirectory ( dir, cwd ) {

    var theDir = dir.src || dir;

    var dirSrc = path.isAbsolute( theDir ) ? theDir : path.resolve( cwd, theDir )
        , dirOpts = dir.options || { nodir: true } 
        ;

    dirOpts.cwd = dirOpts.cwd || cwd;

    return {
        src: dirSrc,
        options: dirOpts
    };

}

module.exports = module.exports.init = init;
module.exports.defaults = defaults;
