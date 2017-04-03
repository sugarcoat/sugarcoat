var path = require( 'path' );

var _ = require( 'lodash' );
var log = require( '../../lib/logger' );
var util = require( 'util' );

/**
 * Default configuration values
 */
var defaults = {};
var defaultAssets = 'sugarcoat/**/*';
var defaultAssetStr = 'sugarcoat';
var cwdTemplates = path.join( __dirname, 'templates' );
var defaultPartials = `${path.join( cwdTemplates, 'partials' )}/**/*`;

defaults.settings = {};
defaults.settings.cwd = process.cwd();
defaults.settings.dest = null;
defaults.settings.format = null;

defaults.display = {};
defaults.display.graphic = null;
defaults.display.headingText = null;
defaults.display.title = 'Pattern Library';

defaults.settings.template = {};
defaults.settings.template.cwd = process.cwd();
defaults.settings.template.layout = path.join( cwdTemplates, 'main.hbs' );

defaults.include = {};
defaults.template = {};
defaults.template.prefixSelector = '.sugar-example';

function init( options ) {

    var addDefaultAssets = false
        , defaultsCopy = _.cloneDeep( defaults )
        , config = _.merge( defaultsCopy, options )
        , settings = config.settings
        , template = settings.template
        , prefix = settings.prefix
        , error = []
        ;

    // Configure the logger
    log.config( config.settings.log );

    // **** ASSETS (template) ****

    // Set Assets to an array
    if ( _.isEmpty( template.assets ) ) {

        template.assets = [ defaultAssets ];
    }

    // Set Assets to an array
    if ( !_.isArray( template.assets ) ) {

        template.assets = [ template.assets ];
    }

    // Add in the default assets
    if ( _.includes( template.assets, defaultAssetStr ) ) {

        addDefaultAssets = true;

        // Get the sugarcoat string out of the array
        _.pull( template.assets, defaultAssetStr );
    }

    // Convert remaining array pieces into a file object
    template.assets = template.assets.map( dirPath => {
        return normalizeDirectory( dirPath, template.cwd );
    });

    // Add in the default assets
    if ( addDefaultAssets ) {
        template.assets.push( normalizeDirectory( path.resolve( cwdTemplates, defaultAssets ), cwdTemplates ) );
    }

    // **** ASSETS (prefix) ****
    if ( !_.isEmpty( include.css ) ) {
        include.css = include.css.map( dirPath => {

            return normalizeDirectory( dirPath, process.cwd() );
        });
    }


    // **** LAYOUT ****

    // Resolve all paths
    template.layout = path.resolve( template.cwd, template.layout );


    // **** PARTIALS ****

    template.partials = template.partials || [];

    // If partials is empty or falsy, then set our defaults
    if ( _.isArray( template.partials ) ) {

        // normalize the contents of the array
        template.partials = template.partials.map( dirPath => {

            return normalizeDirectory( dirPath, template.cwd );
        });
    }
    else {

        // use new function on it
        template.partials = [ normalizeDirectory( template.partials, template.cwd ) ];
    }

    // then add defaults on
    template.partials.unshift( normalizeDirectory( defaultPartials, template.cwd ) );


    // **** SETTINGS ****

    if ( settings.dest && settings.dest === 'none' ) {

        settings.dest = null;

    }
    else if ( settings.dest ) {

        settings.dest = path.resolve( settings.cwd, settings.dest );

    }
    else {

        error.push({
            key: 'settings.dest',
            msg: 'Destination is required. Please add the `dest` option to your settings object as a path to your destination or `none`.'
        });
    }

    // **** SECTIONS ****

    if ( !config.sections ) {

        error.push({
            key: 'section',
            msg: 'A section array of one or more objects is required. Please add a section object to the sections array.'
        });

    }
    else {

        if ( config.sections.length < 0 || !config.sections.length ) {

            error.push({
                key: 'section',
                msg: 'Section objects are required in the sections array. Please add a section object to the section array.'
            });

        }
        else {

            config.sections.forEach( sectionObject => {

                var loggedSection = util.inspect( sectionObject, { depth: 7, colors: true } );

                if ( !sectionObject.mode ) {
                    sectionObject.mode = undefined;
                }

                if ( !sectionObject.template ) {
                    sectionObject.template = `section-${ sectionObject.mode || 'default' }`;
                }

                if ( !sectionObject.title ) {

                    error.push({
                        key: 'sections.title',
                        msg: `Title is required. Please add a 'title' option to section object: \n${loggedSection}`
                    });
                }

                if ( !sectionObject.files ) {

                    error.push({
                        key: 'sections.files',
                        msg: `Files is required. Please add a 'files' option to section object: \n${loggedSection}`
                    });
                }
            });
        }
    }

    if ( error.length ) {

        for ( var errObj in error ) {

            var key = error[ errObj ].key;
            var msg = error[ errObj ].msg;

            log.error( `Configure: ${key}`, msg );
        }

        return error;

    }

    return config;
}

function normalizeDirectory( dir, cwd ) {

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
