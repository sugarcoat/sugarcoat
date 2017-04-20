'use strict';

var path = require( 'path' );
var _ = require( 'lodash' );
var postcss = require( 'postcss' );
var prefixer = require( 'postcss-prefix-selector' );
var Handlebars = require( 'handlebars' );

var hbsHelpers = require( './handlebars-helpers' );
// var log = require( './logger' );
var globber = require( './globber' );
var fsp = require( './fs-promiser' );

module.exports = function ( config ) {

    Handlebars.registerHelper( hbsHelpers );

    return globPartials( config )
    .then( readPartials )
    .then( registerPartials )
    .then( config => {

        if ( config.settings.prefix.assets ) {

            return globPrefixAssets( config )
            .then( prefixAssets );
        }
        else return config;
    })
    .then( copyAssets )
    .then( config => {

        if ( config.settings.dest !== null ) {

            return renderLayout(config)
            .then( () => {

                return config;
            });

        }
        else return config;
    })
    .catch( err => err );
};

/*
    Tasks
*/
function copyAssets( config ) {

    var flattened = []
        , dest = config.settings.dest !== null ? config.settings.dest : config.settings.cwd
        ;

    var expand = config.settings.template.assets.map( function ( asset ) {

        return globber({
            src: asset.src,
            options: asset.options
        })
        .then( function ( files ) {

            asset.srcFiles = files;

            return asset.srcFiles.map( assetPath => {

                var result = {
                    from: path.resolve( asset.options.cwd, assetPath ),
                    to: path.resolve( dest, path.relative( asset.options.cwd, assetPath ) )
                };

                flattened.push( result );

                return result;
            });
        });
    });

    return Promise.all( expand )
    .then( () => {

        return Promise.all( flattened.map( asset => {

            return fsp.copy( asset.from, asset.to )
            .then( assetPaths => {

                // TODO: find another way to display this info to the user, or do we really need to?
                // return log.info( 'Render', `asset copied: ${ path.relative( dest, assetPaths[ 1 ] )}`);
            });
        }));
    })
    .then( () => {

        return config;
    })
    .catch( err => err );
}

function globPartials( config ) {

    return globFiles( config.settings.template.partials )
    .then( partials => {
        config.settings.template.partials = _.flatten( partials );

        return config;
    }).catch( err => err );
}

function readPartials( config ) {

    var partials = config.settings.template.partials.map( fileObj => {

        return fsp.readFile( fileObj.file )
        .then( data => {

            return fileObj.src = data;
        });
    });

    return Promise.all( partials )
    .then( () => {
        return config;
    });
}

function registerPartials( config ) {

    config.settings.template.partials.forEach( partial => {

        var isOverride = !!Handlebars.partials[ partial.name ]
            // , msgNormal = `partial registered: "${partial.name}"`
            // , msgOverride = `partial registered: "${partial.name}" partial has been overridden`
            // , msg = isOverride ? msgOverride : msgNormal
            ;

        if ( isOverride ) Handlebars.unregisterPartial( partial.name );

        Handlebars.registerPartial( partial.name, partial.src );

        // TODO: find another way to display info to the user, or do we need to?
        // log.info( 'Render', msg );
    });

    return config;
}

function globPrefixAssets( config ) {

    return globFiles( config.settings.prefix.assets )
    .then( assets => {
        config.settings.prefix.assets = _.flatten( assets );

        return config;
    })
    .catch( err => err );
}

function prefixAssets( config ) {

    return Promise.all( config.settings.prefix.assets.map( file => {

        file.prefixed = `sugarcoat/css/prefixed-${file.name}.css`;

        return  fsp.readFile( file.file )
        .then( data => {

            return postcss()
            .use( prefixer({
                prefix: config.settings.prefix.selector
            }))
            .process( data )
            .then( result => {

                return fsp.writeFile( path.join( config.settings.dest, file.prefixed ), result.css );
            })
            .then( result => {

                // TODO: find another way to display info to the user, or do we need to?
                // log.info( 'Render', `asset prefixed: ${path.relative( config.settings.cwd, path.join( config.settings.dest, file.prefixed ) )}`);

                return result;
            });
        });
    }))
    .then( () => {

        return config;
    })
    .catch( err => err );
}

function renderLayout( config ) {

    return fsp.readFile( config.settings.template.layout )
    .then( function ( data ) {

        return config.settings.template.layout = {
            src: data,
            file: config.settings.template.layout
        };
    })
    .then( function () {

        var hbsCompiled = Handlebars.compile( config.settings.template.layout.src, {
                preventIndent: true
            })
            , file = path.join( config.settings.dest, 'index.html' )
            , html = hbsCompiled( config )
            ;

        return fsp.writeFile( file, html )
        .then( () => {

            // TODO: find another way to display this info to the user, or do we need it?
            // log.info( 'Render', `layout rendered "${path.relative( config.settings.cwd, file )}"` );

            return html;
        });
    })
    .catch( err => err );
}

/*
    Utilities
 */

function globFiles( files ) {

    var globArray = files.map( file => {

        return globber({
            src: file.src,
            options: file.options
        })
        .then( files => {

            return files.reduce( ( collection, filePath ) => {

                collection.push({
                    cwd: file.src,
                    file: filePath,
                    name: path.basename( filePath, path.parse( filePath ).ext )
                });

                return collection;
            }, []);
        })
        .catch( err => err );
    });

    return Promise.all( globArray );
}