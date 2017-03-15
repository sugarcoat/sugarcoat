var path = require( 'path' );

var _ = require( 'lodash' );

var log = require( '../../lib/logger' );

/**
 * Default configuration values
 */
var defaults = {};
var defaultAssets = 'sugarcoat/**/*';
var defaultAssetStr = 'sugarcoat';
var cwdTemplates = path.join( __dirname, 'templates' );
var defaultPartials = `${path.join( cwdTemplates, 'partials' )}/**/*`;
var defaultPartialsDir = path.join( cwdTemplates, 'partials' );

defaults.settings = {};
defaults.settings.cwd = process.cwd();
defaults.settings.dest = null;
defaults.settings.format = null;
defaults.settings.title = 'Pattern Library';

defaults.settings.template = {};
defaults.settings.template.cwd = process.cwd();
defaults.settings.template.layout = path.join( cwdTemplates, 'main.hbs' );

defaults.settings.partials = {
    'block-title': `${defaultPartialsDir}/block-title.hbs`,
    'footer': `${defaultPartialsDir}/footer.hbs`,
    'head': `${defaultPartialsDir}/head.hbs`,
    'nav': `${defaultPartialsDir}/nav.hbs`,
    'section-color': `${defaultPartialsDir}/section-color.hbs`,
    'section-default': `${defaultPartialsDir}/section-default.hbs`,
    'section-typography': `${defaultPartialsDir}/section-typography.hbs`,
    'section-variable': `${defaultPartialsDir}/section-variable.hbs`
};

defaults.settings.prefix = {};
defaults.template = {};
defaults.template.selectorPrefix = '.sugar-example';

function init( options ) {

    var addDefaultAssets = false
        , defaultsCopy = _.cloneDeep( defaults )
        , config = _.merge( defaultsCopy, options )
        , settings = config.settings
        , template = settings.template
        , prefix = settings.prefix
        ;

    // Configure the logger
    log.config( options.settings.log );

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

    if ( !_.isEmpty( prefix.assets ) ) {
        prefix.assets = prefix.assets.map( dirPath => {

            return normalizeDirectory( dirPath, process.cwd() );
        });
    }


    // **** LAYOUT ****

    // Resolve all paths
    template.layout = path.resolve( template.cwd, template.layout );


    // **** PARTIALS ****
    Object.keys( settings.partials ).forEach( ( key, index ) => {

        settings.partials[ key ] = normalizeDirectory( settings.partials[ key ], process.cwd() );
    });

    // **** SETTINGS ****

    if ( settings.dest ) {
        settings.dest = path.resolve( settings.cwd, settings.dest );
    }

    // **** SECTIONS ****

    config.sections.forEach( sectionObject => {

        if ( !sectionObject.mode ) {
            sectionObject.mode = undefined;
        }

        if ( !sectionObject.template ) {
            sectionObject.template = `section-${ sectionObject.mode || 'default' }`;
        }
    });

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
