var fs = require( 'fs' )
var util = require( 'util' );
var path = require( 'path' );

var _ = require( 'lodash' );
var mkdirp = require( 'mkdirp' );
var Handlebars = require( 'handlebars' );
var hbsHelpers = require( '../../lib/handlebars-helpers.js' );

var log = require( '../../lib/logger' );
var globber = require( '../../lib/globber' );

module.exports = function ( config ) {

    Handlebars.registerHelper( hbsHelpers );

    return globPartials( config )
    .then( readPartials )
    .then( registerPartials )
    .then( copyAssets )
    .then( renderLayout )
    .catch( function ( err ) {
        return err;
    });
}

/*
    Tasks
*/

function globPartials( config ) {

    var partials = config.settings.template.partials.map( function( dir ) {

        return globber({
            src: [ path.join( dir.src, '**/*' ) ],
            options: dir.options
        })
        .then( function ( files ) {

            return files.reduce( function ( collection, filePath ) {

                collection.push({
                    cwd: dir.src,
                    file: filePath,
                    name: path.relative( dir.src, filePath ).replace( path.parse( filePath ).ext, '' )
                });

                return collection;

            }, [] );
        });
    });

    return Promise.all( partials )
    .then( function ( files ) {

        // files = _.flatten( files );
        config.settings.template.partials = _.flatten( files );
        
        return config;
    }).catch( function ( err ) {

        console.log(err.message);
    });
}

function readPartials( config ) {

    var partials = config.settings.template.partials.map( function ( fileObj ) {

        return readFile( fileObj.file )
        .then( function ( data ) {

            return fileObj.src = data;
        })
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

        var hbsCompiled = Handlebars.compile( config.settings.template.layout.src )
            , file = path.join( config.settings.dest, 'index.html' )
            , html = hbsCompiled( config.sections )
            ;

        return writeFile( file, html )
        .then( function() {

            log.info( 'Render', `layout rendered "${path.relative( config.settings.cwd, file )}"` );

            return html;
        });
    });
}

function copyAssets( config ) {

    var flattened = []
        , dest = config.settings.dest
        , assets = config.settings.template.assets
        ;

    // console.log('assets', util.inspect( assets, { depth: 7, colors: true } ) );

    var expand = assets.map( function ( assetObj ) {

        var relDir = path.relative( assetObj.cwd, assetObj.dir );

        // console.log('relative path', relDir);

        return globber({
            src: path.join( relDir, '**/*' ),
            options: {
                cwd: assetObj.cwd,
                nodir: true
            }
            //once i add teh objects options here i get an error 
            //options: assetObj.options
            //do the sugarcoat defaults have to have the specific options above? 
        })
        .then( function ( expandedPaths ) {

            // console.log('expanded paths', util.inspect( expandedPaths, { depth: 7, colors: true } ) );

            assetObj.srcFiles = expandedPaths;

            return assetObj.srcFiles.map( function ( assetPath ) {

                var result = {
                    from: path.resolve( assetObj.cwd, assetPath ),
                    to: path.resolve( dest, assetPath )
                };

                // console.log('result', util.inspect( result, { depth: 7, colors: true } ) );

                flattened.push( result );

                // console.log('flattened', util.inspect( flattened, { depth: 7, colors: true } ) );

                // console.log('last result', util.inspect( result, { depth: 7, colors: true } ) );

                return result;
            });
        });
    });

    return Promise.all( expand )
    .then( function () {

        return Promise.all( flattened.map( function ( assetObj ) {

            return copy( assetObj.from, assetObj.to )
            .then( function ( assetPaths ) {

                return log.info( 'Render', `asset copied: "${ path.relative( dest, assetPaths[1] ) }"` );
            });
        }));
    })
    .then( function () {
        return config;
    })
    .catch( function ( err ) {
        log.error( 'Render', err );
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
    })
}