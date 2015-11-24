/*
    TODO Can this be refactored to not require a Constructor?
*/
var fs = require( 'fs' )
var util = require( 'util' );
var path = require( 'path' );

var _ = require( 'lodash' );
var mkdirp = require( 'mkdirp' );
var Handlebars = require( 'handlebars' );
var hbsHelpers = require( '../../lib/handlebars-helpers.js' );

var log = require( '../../lib/logger' );
var globber = require( '../../lib/globber' );

function Render( config ) {

    this.config = config;
    this.dest = config.settings.dest;

    log.config( config.settings.log );

    Handlebars.registerHelper( hbsHelpers );

    if ( !config.settings.json && !config.settings.dest ) {

        throw new Error( 'Error: Please provide destination' );
    }

    return this.setupHandlebars( config.settings )
    .then( function () {
        return normalizeAssets( config.settings );
    })
    .then( function () {
        return config;
    }).catch( function ( err ) {
        log.error( 'Render', err );
    });
}

Render.prototype = {

    setupHandlebars: function( settings ) {

        var self = this
            , template = settings.template
            , partialsDir = template.partials
            , layout = template.layout
            ;

        partialsDir = partialsDir.map( function( dirPath ) {

            return globber({
                src: [ path.join( dirPath, '**/*' ) ],
                options: {
                    nodir: true
                }
            })
            .then( function ( files ) {

                return {
                    cwd: dirPath,
                    srcFiles: files
                };
            });
        });

        return Promise.all( partialsDir )
        .then( flattenArray )
        .then( this.managePartials.bind( this ) )
        .then( this.registerPartials.bind( this ) )
        .then( function () {

            return new Promise( function ( resolve, reject ) {

                fs.readFile( layout, 'utf8', function( err, data ) {

                    if ( err ) return reject( err );

                    self.template = Handlebars.compile( data );

                    resolve();

                });
            })
            .then( function () {
                return self.renderTemplate();
            });
        });
    },

    managePartials: function( partials ) {

        var self = this;

        this.partials = partials;

        partials = partials.map( function( partial ) {

            var arr = [];

            partial.srcFiles.forEach( function ( srcFile ) {

                arr.push( self.getPartial( srcFile, partial.cwd ) );
            });

            return Promise.all( arr ).then( flattenArray );
        })

        return Promise.all( partials ).then( flattenArray );
    },

    getPartial: function( srcFile, cwd ) {

        return new Promise( function( resolve, reject ) {

            fs.readFile( srcFile, 'utf8', function( err, data ) {

                if ( err ) return reject( err );

                return resolve({
                    file: path.relative( cwd, srcFile ),
                    data: data
                });
            });
        });
    },

    registerPartials: function( partials ) {

        partials.forEach( function( partial ) {

            var name = partial.file.replace( path.parse( partial.file ).ext, '' )
                , isOverride = !!Handlebars.partials[ name ]
                , msgNormal = `partial registered: "${name}"`
                , msgOverride = `partial registered: "${name}" partial has been overridden`
                , msg = isOverride ? msgOverride : msgNormal
                ;

            if ( isOverride ) Handlebars.unregisterPartial( name );

            Handlebars.registerPartial( name, partial.data );

            log.info( 'Render', msg );
        });

        return partials;
    },

    renderTemplate: function() {

        var cwd = this.config.settings.cwd
            , markup = this.template( this.config.sections )
            , file = path.join( `${this.dest}`, 'index.html' )
            ;

        return writeFile( file, markup ).then( function( file ) {
            return log.info( 'Render', `layout rendered "${path.relative( cwd, file )}"` );
        });
    }
};

function flattenArray( arr ) {
    return _.flatten( arr );
}

function normalizeAssets( settings ) {

    var flattened = []
        , dest = settings.dest
        , assets = settings.template.assets
        ;

    var expand = assets.map( function ( assetObj ) {

        var relDir = path.relative( assetObj.cwd, assetObj.dir );

        return globber({
            src: path.join( relDir, '**/*' ),
            options: {
                cwd: assetObj.cwd,
                nodir: true
            }
        })
        .then( function ( expandedPaths ) {

            assetObj.srcFiles = expandedPaths;

            return assetObj.srcFiles.map( function ( assetPath ) {

                var result = {
                    from: path.resolve( assetObj.cwd, assetPath ),
                    to: path.resolve( dest, assetPath )
                };

                flattened.push( result );

                return result;
            });
        });
    });

    return Promise.all( expand ).then( function () {

        return Promise.all( flattened.map( function ( assetObj ) {

            return copy( assetObj.from, assetObj.to )
            .then( function ( assetPaths ) {

                log.info( 'Render', `asset copied: "${ path.relative( dest, assetPaths[1] ) }"` );
                return;
            });
        }));
    })
    .catch( function ( err ) {
        log.error( err );
    });
}

function copy( fromPath, toPath ) {

    var reader = fs.createReadStream( fromPath )
        , writer = fs.createWriteStream( toPath )
        ;

    return new Promise( function ( resolve, reject ) {

        reader.on( 'error', reject );
        writer.on( 'error', reject );

        writer.on( 'finish', function() {

            resolve( [ fromPath, toPath ] );
        });

        mkdirp( path.parse( toPath ).dir, function ( err ) {

            if ( err ) return reject( err );

            reader.pipe( writer );
        });
    });
}

// TODO return a Promise
function writeFile( file, contents ) {

    return new Promise( function ( resolve, reject ) {

        mkdirp( path.parse( file ).dir, function ( err ) {

            if ( err ) return reject( err );

            fs.writeFile( file, contents, function ( err ) {

                if ( err ) return reject( err );

                resolve( file );
            });
        });
    });
}

module.exports = function( config ) {

    return new Render( config );
};