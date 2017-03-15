var path = require( 'path' );

var _ = require( 'lodash' );
var postcss = require( 'postcss' );
var prefixer = require( 'postcss-prefix-selector' );
var Handlebars = require( 'handlebars' );

var log = require( '../../lib/logger' );
var globber = require( '../../lib/globber' );
var fsp = require( '../../lib/fs-promiser' );

module.exports = function ( config ) {

    Handlebars.registerHelper( config.template.helpers );

    return registerPartials( config )
    .then( config => {

        if ( config.settings.prefix.assets ) {

            return globPrefixAssets( config )
            .then( prefixAssets );
        }
        else return config;
    })
    .then( copyAssets )
    .then( renderLayout )
    .catch( err => {
        return err;
    });
};

/*
    Tasks
*/
function registerPartials( config ) {

    var promisePartials = [];

    Object.keys( config.template.partials ).forEach( key => {

        promisePartials.push( fsp.readFile( config.template.partials[ key ].src )
        .then( data => {

            Handlebars.registerPartial( key, data );

            log.info( 'Render', `partial registered: ${ key }` );
        })
        .catch( err => {
            log.error( 'Render: Register Partials', err );

            return err;
        }));
    });

    return Promise.all( promisePartials )
    .then( () => {

        return config;
    });
}
function renderLayout( config ) {

    return fsp.readFile( config.template.layout )
    .then( data => {

        return config.template.layout = {
            src: data,
            file: config.template.layout
        };
    })
    .then( () => {

        var hbsCompiled = Handlebars.compile( config.template.layout.src, {
                preventIndent: true
            })
            , file = path.join( config.settings.dest, 'index.html' )
            , html = hbsCompiled( config )
            ;

        return fsp.writeFile( file, html )
        .then( () => {

            log.info( 'Render', `layout rendered "${path.relative( config.settings.cwd, file )}"` );

            return html;
        });
    })
    .catch( err => {
        log.error( 'Render', err );

        return err;
    });
}

function globPrefixAssets( config ) {

    return globFiles( config.settings.prefix.assets )
    .then( assets => {
        config.settings.prefix.assets = _.flatten( assets );

        return config;
    })
    .catch( err => {

        log.error( 'Glob Prefix Assets', err );
    });
}

function prefixAssets( config ) {

    return Promise.all( config.settings.prefix.assets.map( file => {

        file.prefixed = `sugarcoat/css/prefixed-${file.name}.css`;

        return  fsp.readFile( file.file )
        .then( data => {

            return postcss()
            .use( prefixer({
                prefix: config.template.selectorPrefix
            }))
            .process( data )
            .then( result => {

                return fsp.writeFile( path.join( config.settings.dest, file.prefixed ), result.css );
            })
            .then( result => {
                log.info( 'Render', `asset prefixed: ${path.relative( config.settings.cwd, path.join( config.settings.dest, file.prefixed ) )}`);

                return result;
            });
        });
    }))
    .then( () => {

        return config;
    })
    .catch( ( err ) => {
        log.error( 'Prefix Assets', err );

        return err;
    });
}

function copyAssets( config ) {

    var flattened = [];

    var expand = config.settings.template.assets.map( asset => {

        return globber({
            src: asset.src,
            options: asset.options
        })
        .then( files => {

            asset.srcFiles = files;

            return asset.srcFiles.map( assetPath => {

                var result = {
                    from: path.resolve( asset.options.cwd, assetPath ),
                    to: path.resolve( config.settings.dest, path.relative( asset.options.cwd, assetPath ) )
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

                return log.info( 'Render', `asset copied: ${ path.relative( config.settings.dest, assetPaths[ 1 ] )}`);
            });
        }));
    })
    .then( () => {

        return config;
    })
    .catch( err => {
        log.error( 'Copy Assets', err );

        return err;
    });
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
        });
    });

    return Promise.all( globArray );
}