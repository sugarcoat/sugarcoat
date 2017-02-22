var fs = require( 'fs' );
var util = require( 'util' );
var path = require( 'path' );

var _ = require( 'lodash' );
var fsp = require( 'fs-promise' );
var mkdirp = require( 'mkdirp' );
var postcss = require( 'postcss' );
var prefixer = require( 'postcss-prefix-selector' );
var Handlebars = require( 'handlebars' );
var hbsHelpers = require( '../../lib/handlebars-helpers.js' );

var log = require( '../../lib/logger' );
var globber = require( '../../lib/globber' );

module.exports = function ( config ) {

    Handlebars.registerHelper( hbsHelpers );

    return globPartials( config )
    .then( readPartials )
    .then( registerPartials )
    .then( function( config ) {

        if ( config.settings.prefix.assets ) {

            return globPrefixAssets( config )
            .then( prefixAssets );
        }
        else return config;
    })
    .then( copyAssets )
    .then( renderLayout )
    .catch( function ( err ) {
        return err;
    });
};

/*
    Tasks
*/

function globPartials( config ) {

    return globFiles( config.settings.template.partials )
    .then( function ( partials ) {
        config.settings.template.partials = _.flatten( partials );

        return config;
    }).catch( function ( err ) {

        log.error( 'Glob Partials', err );
    });
}

function readPartials( config ) {

    var partials = config.settings.template.partials.map( function ( fileObj ) {

        return readFile( fileObj.file )
        .then( function ( data ) {

            return fileObj.src = data;
        });
    });

    return Promise.all( partials )
    .then( function () {
        return config;
    });
}

function registerPartials( config ) {

    config.settings.template.partials.forEach( function( partial ) {

        var isOverride = !!Handlebars.partials[ partial.name ]
            , msgNormal = `partial registered: "${partial.name}"`
            , msgOverride = `partial registered: "${partial.name}" partial has been overridden`
            , msg = isOverride ? msgOverride : msgNormal
            ;

        if ( isOverride ) Handlebars.unregisterPartial( partial.name );

        Handlebars.registerPartial( partial.name, partial.src );

        log.info( 'Render', msg );
    });

    return config;
}

function renderLayout( config ) {

    return readFile( config.settings.template.layout )
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

        return writeFile( file, html )
        .then( function() {

            log.info( 'Render', `layout rendered "${path.relative( config.settings.cwd, file )}"` );

            return html;
        });
    })
    .catch( function ( err ) {
        log.error( 'Render', err );
        return err;
    });
}

function globPrefixAssets( config ) {

    return globFiles( config.settings.prefix.assets )
    .then( function( assets ) {

        config.settings.prefix.assets = _.flatten( assets );
        return config;
    })
    .catch( function ( err ) {

        log.error( 'Glob Prefix Assets', err );
    });
}

function prefixAssets( config ) {

    var files = config.settings.prefix.assets.map( function ( file ) {

        file.prefixed = `sugarcoat/css/prefixed-${file.name}.css`;

        fs.readFile( file.file, function ( err ,css ) {

            postcss()
            .use( prefixer({
                prefix: config.settings.prefix.selector
            }))
            .process( css )
            .then( function ( result ) {
                return writeFile( path.join( config.settings.dest, file.prefixed ), result.css )
            })
            .then( function ( result ) {

                log.info( 'Render', `asset prefixed: ${path.relative( config.settings.cwd, path.join( config.settings.dest, file.prefixed ) )}`);
                return result;
            });
        });
    });

    return Promise.all( files )
        .then( function () {

            return config;
        })
        .catch( function ( err ) {

            log.error( 'Prefix Assets', err );
            return err;
        });
}

function copyAssets( config ) {

    var flattened = [];

    var expand = config.settings.template.assets.map( function ( asset ) {

        return globber({
            src: asset.src,
            options: asset.options
        })
        .then( function ( files ) {

            asset.srcFiles = files;

            return asset.srcFiles.map( function( assetPath ) {

                var result = {
                    from: path.resolve( asset.options.cwd, assetPath ),
                    to: path.resolve( config.settings.dest, path.relative( asset.options.cwd, assetPath ) )
                };

                flattened.push( result );

                return result;
            })
        });
    });

    return Promise.all( expand )
    .then( function() {

        return Promise.all( flattened.map( function( asset ) {


            return copy( asset.from, asset.to )
            .then( function ( assetPaths ) {

                return log.info( 'Render', `asset copied: ${ path.relative( config.settings.dest, assetPaths[ 1 ] )}`);
            })
        }))
    })
    .then( function() {
        return config;
    })
    .catch( function ( err ) {

        log.error( 'Copy Assets', err );
        return err;
    });
}

/*
    Utilities
*/
function copy( fromPath, toPath ) {

    return new Promise( function ( resolve, reject ) {

        makeDirs( toPath )
        .then( function () {

            var reader = fs.createReadStream( fromPath )
                , writer = fs.createWriteStream( toPath )
                ;

            reader.on( 'error', reject );
            writer.on( 'error', reject );

            writer.on( 'finish', function() {

                resolve( [ fromPath, toPath ] );
            });

            reader.pipe( writer );
        })
        .catch( function ( err ) {
            log.error( 'Render', err );
            return err;
        });
    });
}

function readFile( file ) {

    return new Promise( function( resolve, reject ) {

        fs.readFile( file, 'utf8', function( err, data ) {

            if ( err ) return reject( err );

            return resolve( data );
        });
    });
}

function writeFile( file, contents ) {

    return new Promise( function ( resolve, reject ) {

        makeDirs( file )
        .then( function () {

            fs.writeFile( file, contents, function ( err ) {

                if ( err ) return reject( err );

                return resolve( file );
            });
        });
    });
}

function makeDirs( toPath ) {

    return new Promise( function ( resolve, reject ) {

        mkdirp( path.parse( toPath ).dir, function ( err ) {

            if ( err ) return reject( err );

            resolve();
        });
    });
}

function globFiles( files ) {

    var globArray = files.map( function( file ) {

        return globber({
            src: file.src,
            options: file.options
        })
        .then( function ( files ) {

            return files.reduce( function ( collection, filePath ) {

                collection.push({
                    cwd: file.src,
                    file: filePath,
                    name: path.basename( filePath, path.parse( filePath ).ext )
                });

                return collection;
            }, []);
        })
    });

    return Promise.all( globArray );
}