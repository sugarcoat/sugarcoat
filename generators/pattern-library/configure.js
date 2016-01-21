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
defaults.settings.template.assets = [];
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
        , shouldGetDefaultAssets = _.isEmpty( template.assets ) || _.includes( template.assets, defaultAssets ) || _.some( template.assets, [ 'src', defaultAssets ] )
        , assetSrc
        , assetOpts
        ;

    // Configure the logger
    log.config( options.settings.log );

    // **** ASSETS ****

    // Remove `defaultAssets` keyword, if present in assets
    if ( template.assets[0].hasOwnProperty('src') ) {

        var sugarcoatAssetsArray = _.remove( template.assets, function (obj) {

            return obj.src === defaultAssets;
        });
    }
    else {

        _.pull( template.assets, defaultAssets );
    }

    // Convert to a file object
    template.assets = template.assets.map( function ( dirPath ) {

        assetSrc = ( dirPath.src ) ? dirPath.src : dirPath
        , assetOpts = ( dirPath.options ) ? dirPath.options : { nodir: true }
        ;

        return {
            cwd: template.cwd,
            dir: path.resolve( template.cwd, assetSrc ),
            options: assetOpts
        }
    });

    // Add in the default assets
    if ( shouldGetDefaultAssets ) {

        var sugarcoatAsset = _.find( options.settings.template.assets, [ 'src', defaultAssets ] );

        template.assets.push({
            cwd: cwdTemplates,
            dir: path.resolve( cwdTemplates, defaultAssets ),
            options: ( sugarcoatAsset.options ) ? sugarcoatAsset.options : { cwd: cwdTemplates, nodir: true }
        });
    }

    // **** LAYOUT ****
    
    // Resolve all paths
    template.layout = path.resolve( template.cwd, template.layout );


    // **** PARTIALS **** 
    console.log('orig partials', util.inspect( template.partials, { depth: 7, colors: true } ) );


    // If partials is empty or falsy, then set our defaults
    if( _.isEmpty( template.partials ) ) {

        console.log('this is falsey');
        template.partials = [ normalizeDirectory( defaultPartials, template.cwd ) ];
    }

    else if( _.isArray( template.partials ) ) {

        console.log('this is an array');
        //normalize the contents of the array
        template.partials = template.partials.map( function ( dirPath ) {

            return normalizeDirectory( dirPath, template.cwd );
        });

        //then add defaults on
        defaultPartials = [ normalizeDirectory( defaultPartials, template.cwd ) ];
        template.partials = defaultPartials.concat( template.partials );
    }
    else {

        console.log('not empty or array');
        //use new function on it 
        template.partials = [ normalizeDirectory( template.partials, template.cwd ) ];

        //then add defaults on
        defaultPartials = [ normalizeDirectory( defaultPartials ) ];
        template.partials = defaultPartials.concat( template.partials );
    }

    console.log('after work', util.inspect( template.partials, { depth: 7, colors: true } ) );
    
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

    var dirSrc = path.resolve( dir.src || dir )
        , dirOpts = dir.options || { nodir: true }
        ;

    return {
        src: dirSrc,
        options: dirOpts
    };

}

module.exports = module.exports.init = init;
module.exports.defaults = defaults;
