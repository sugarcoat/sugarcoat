/*
    TODO Can this be refactored to not require a Constructor?
*/
var fs = require( 'fs' )
var util = require( 'util' );
var path = require( 'path' );

var _ = require( 'lodash' );
var glob = require( 'glob' );
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

    this.copyAssets( config.settings );

    this.setupHandlebars( config.settings );

    return this.config;
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

        Promise.all( partialsDir ).then( flattenArray )
        .then( this.managePartials.bind( this ) )
        .then( this.registerPartials.bind( this ) )
        .then( function () {

            fs.readFile( layout, 'utf8', function( err, data ) {

                if ( err ) throw new Error( err );

                self.template = Handlebars.compile( data );
                self.renderTemplate();

                return;
            });
        })
        .catch( function ( err ) {
            log.error( 'Render', err );
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
    },

    renderTemplate: function() {

        var cwd = this.config.settings.cwd
            , markup = this.template( this.config.sections )
            , file = path.join( `${this.dest}`, 'index.html' )
            ;

        writeFile( file, markup, function( err ) {

            if ( err ) throw new Error( err );

            return log.info( 'Render', `layout rendered "${path.relative( cwd, file )}"` );
        });
    },

    copyAssets: function( settings ) {

        var self = this
            , dest = settings.dest
            , assets = settings.template.assets
            ;

        assets = assets.map( function ( asset ) {

            var pattern = path.join( asset.dir, '**/*' );

            var srcExecutor = function ( resolve, reject ) {

                return glob( pattern, { nodir: true }, function ( err, files ) {

                    if ( err ) return reject( err );

                    asset.srcFiles = files;

                    return resolve( asset );
                })
            };

            return new Promise( srcExecutor );
        });

        Promise.all( assets )
        .then( function ( assets ) {

            assets = _.flatten( assets );

            assets = assets.map( function ( asset ) {

                asset.destFiles = [];

                asset.srcFiles.forEach( function ( srcFile ) {

                    asset.destFiles.push( path.join( dest, path.relative( asset.cwd, srcFile ) ) );
                });

                return asset;
            });

            return assets;

        }).then( function ( assets ) {

            assets = _.flatten( assets );

            assets.forEach( function ( asset ) {

                asset.srcFiles.forEach( function ( srcFile, index ) {

                    self.copyFile( srcFile, asset.destFiles[ index ], asset );
                });
            });

        })
        .catch( function ( err ) {
            log.error( 'Render', err );
        });
    },

    copyFile: function( srcFile, destFile, asset ) {

        var readFile = new Promise( function ( resolve, reject ) {

            fs.readFile( srcFile, 'utf8', function( err, data ) {

                if ( err ) return reject( err );

                return resolve( data );

            });
        });

        readFile.then( function ( data ) {

            return writeFile( destFile, data, function( err ) {

                if ( err ) throw new Error( err );

                log.info( 'Render', `asset copied: "${path.relative( asset.cwd, srcFile )}"` );
            });

        })
        .catch( function ( reason ) {

            log.error( 'Render', reason );
        });
    }
};

function flattenArray( arr ) {
    return _.flatten( arr );
}

// TODO return a Promise
function writeFile( file, contents, callback ) {

    mkdirp( path.parse( file ).dir, function ( err ) {

        if ( err ) return callback( err );

        fs.writeFile( file, contents, callback );
    });
}

module.exports = function( config ) {

    new Render( config );

    return config;
};