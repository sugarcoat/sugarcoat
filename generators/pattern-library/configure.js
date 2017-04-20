'use strict';

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
var defaultPartialsDir = path.join( cwdTemplates, 'partials' );

defaults.cwd = process.cwd();
defaults.dest = null;

defaults.display = {};
defaults.display.graphic = null;
defaults.display.headingText = null;
defaults.display.title = 'Pattern Library';

defaults.template = {};
defaults.template.layout = path.join( cwdTemplates, 'main.hbs' );
defaults.template.selectorPrefix = '.sugar-example';
defaults.template.helpers = require( '../../lib/handlebars-helpers.js' );
defaults.template.partials = {
    'block-title': `${defaultPartialsDir}/block-title.hbs`,
    'footer': `${defaultPartialsDir}/footer.hbs`,
    'head': `${defaultPartialsDir}/head.hbs`,
    'nav': `${defaultPartialsDir}/nav.hbs`,
    'section-color': `${defaultPartialsDir}/section-color.hbs`,
    'section-default': `${defaultPartialsDir}/section-default.hbs`,
    'section-typography': `${defaultPartialsDir}/section-typography.hbs`,
    'section-variable': `${defaultPartialsDir}/section-variable.hbs`
};

defaults.include = {};

function init( options ) {

    var addDefaultAssets = false
        , defaultsCopy = _.cloneDeep( defaults )
        , config = _.merge( defaultsCopy, options )
        , include = config.include
		, template = config.template
        , error = []
        ;

    // Configure the logger
    log.config( config.log );

    // **** ASSETS (template) ****

    // Set Assets to an array
    if ( _.isEmpty( config.copy ) ) {

        config.copy = [ defaultAssets ];
    }

    // Set Assets to an array
    if ( !_.isArray( config.copy ) ) {

        config.copy = [ config.copy ];
    }

    // Add in the default assets
    if ( _.includes( config.copy, defaultAssetStr ) ) {

        addDefaultAssets = true;

        // Get the sugarcoat string out of the array
        _.pull( config.copy, defaultAssetStr );
    }

    // Convert remaining array pieces into a file object
    config.copy = config.copy.map( dirPath => {
        return normalizeDirectory( dirPath, process.cwd() );
    });

    // Add in the default assets
    if ( addDefaultAssets ) {
        config.copy.push( normalizeDirectory( path.resolve( cwdTemplates, defaultAssets ), cwdTemplates ) );
    }

    // **** ASSETS ****
    if ( !_.isEmpty( include.css ) ) {
        include.css = include.css.map( dirPath => {

            return normalizeDirectory( dirPath, process.cwd() );
        });
    }

    if ( !_.isEmpty( config.display.graphic ) ) {

        config.display.graphic = path.resolve( process.cwd(), config.display.graphic );
    }


    // **** LAYOUT ****
    // Resolve all paths
    config.template.layout = path.resolve( process.cwd(), config.template.layout );


    // **** PARTIALS ****
    Object.keys( config.template.partials ).forEach( ( key, index ) => {

        config.template.partials[ key ] = normalizeDirectory( config.template.partials[ key ], process.cwd() );
    });

    // **** SETTINGS ****

    if ( config.dest && config.dest === 'none' ) {

        config.dest = null;

    }
    else if ( config.dest ) {

        config.dest = path.resolve( process.cwd(), config.dest );

    }
    else {

        error.push({
            key: 'config.dest',
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
