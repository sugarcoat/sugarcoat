'use strict';

var path = require( 'path' );

var _ = require( 'lodash' );
// var log = require( './logger' );
var errors = require( './errors');

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
defaults.template.helpers = require( './handlebars-helpers.js' );
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
        ;

    // Configure the logger
    // log.config( config.settings.log );


    // **** DEST ****

    if ( config.dest && config.dest === 'none' ) {

        config.dest = null;

    }
    else if ( config.dest ) {

        config.dest = path.resolve( process.cwd(), config.dest );

    }
    else {

        return config = new Error( errors.configDestMissing );
    }

    // **** COPY ****

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

    // **** INCLUDE ****

    if ( !_.isEmpty( include.css ) ) {

        include.css = include.css.map( dirPath => {

            return normalizeDirectory( dirPath, process.cwd() );
        });
    }

    if ( !_.isEmpty( include.js ) ) {

        include.js = include.js.map( dirPath => {

            return normalizeDirectory( dirPath, process.cwd() );
        });
    }

    // **** TEMPLATE ****

    // If custom selector is used, there must be style sheets provided, layouts, or partials
    if ( template.selectorPrefix !== defaults.template.selectorPrefix && template.selectorPrefix !== null ) {

        if ( !include.css ) {

            return config = new Error( errors.configPrefixAssetsMissing );

        }
        else if ( _.isEmpty( template.layout ) && _.isEmpty( template.partials ) ) {

            return config = new Error( errors.configTemplateOptionsMissing );
        }
    }

    // Resolve all paths
    template.layout = path.resolve( process.cwd(), template.layout );


    // **** partials ****
    Object.keys( template.partials ).forEach( ( key, index ) => {

        template.partials[ key ] = normalizeDirectory( template.partials[ key ], process.cwd() );
    });

    // Helpers can be provided only when partials or layout are provided
    if ( !_.isEmpty( template.helpers ) && _.isEmpty( template.partials ) && _.isEmpty( template.layout ) ) {

        return config = new Error( errors.configTemplateHelpers );
    }

    // **** SECTIONS ****

    if ( !config.sections ) {

        return config = new Error( errors.configSectionArrayMissing );

    }
    else {

        if ( config.sections.length < 0 || !config.sections.length ) {

            return config = new Error( errors.configSectionObjectMissing );

        }
        else {

            config.sections.forEach( sectionObject => {

                if ( !sectionObject.mode ) {

                    sectionObject.mode = undefined;
                }

                if ( !sectionObject.template ) {

                    sectionObject.template = `section-${ sectionObject.mode || 'default' }`;
                }

                if ( !sectionObject.title ) {

                    return config = new Error( errors.configSectionTitleMissing );
                }

                if ( !sectionObject.files ) {

                    return config = new Error( errors.configSectionFileMissing );
                }
            });
        }
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
