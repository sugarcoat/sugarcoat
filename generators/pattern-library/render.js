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
    log.config( config.settings.log );
    Handlebars.registerHelper( hbsHelpers );

    this.customPartials = this.config.settings.partials;

    if ( !config.settings.json && !config.settings.dest ) {

        throw new Error( 'Error: Please provide destination' );
    }

    // required config
    this.dest = config.settings.dest;

    this.setupFiles( this.dest );

    this.setupHandlebars();

    return this.config;
}

Render.prototype = {

    setupHandlebars: function() {

        var self = this
            , template = this.config.settings.template
            , partialsDir = template.partials
            , layout = template.layout
            ;

        partialsDir = partialsDir.map( function( directory ) {

            return globber( path.join( directory, '**/*' ) );
        });

        Promise.all( partialsDir )
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

        this.partials = _.flatten( partials );

        return Promise.all( this.partials.map( function( partial ) {

            return self.getPartials( partial );
        }));
    },

    getPartials: function( filename ) {

        return new Promise( function( resolve, reject ) {

            fs.readFile( filename, 'utf8', function( err, data ) {

                if ( err ) return reject( err );

                log.info( 'Render', `registering partial "${path.basename( filename )}"` );

                return resolve({
                    file: path.basename( filename ),
                    data: data
                });
            });
        });
    },

    registerPartials: function() {

        var partials = arguments[ 0 ];

        partials.forEach( function( partial ) {

            var name = path.parse( partial.file ).name;

            Handlebars.registerPartial( name, partial.data );

        });
    },

    renderTemplate: function() {

        var cwd = this.config.settings.cwd
            , markup = this.template( this.config.sections )
            , file = path.join( `${this.dest}`, 'index.html' )
            ;

        this.writeFile( file, markup, function( err ) {

            if ( err ) throw new Error( err );

            return log.info( 'Render', `template rendered "${path.relative( cwd, file )}"` );
        });
    },

    // creates directories to path name provided if directory doesn't exist, otherwise is a noop.
    writeFile: function( file, contents, callback ) {

        mkdirp( path.dirname( file ), function ( err ) {

            if ( err ) return callback( err );

            fs.writeFile( file, contents, callback );
        });
    },

    copyFile: function( oldFile, newFile ) {

        var destDir = path.parse( newFile )

        //read in furtive CSS
        fs.readFile( oldFile, 'utf8', function( err, data ) {

            if ( err ) throw new Error( err );

            if ( !fs.existsSync( destDir.dir ) ) fs.mkdirSync( destDir.dir );

            fs.writeFile( newFile, data, function( err ){

                if ( err ) throw new Error( err );


                log.info( 'Render', `asset copied "${newFile}"` );
            });
        });
    },

    setupFiles: function( dest ) {

        var destPaths
            , self = this
            , srcPaths = this.config.settings.template.assets
            ;

        srcPaths = srcPaths.map( function ( srcPath ) {

            srcPath = path.join( srcPath, '**/*' );

            var srcExecutor = function ( resolve, reject ) {

                return glob( srcPath, function ( err, file ) {

                    if ( err ) return reject( err );

                    return resolve( file );
                })
            };

            return new Promise( srcExecutor );
        });

        Promise.all( srcPaths )
        .then( function ( files ) {

            srcPaths = _.flatten( files );

            destPaths = srcPaths.map( function ( file ) {
                return path.join( dest, path.relative( self.config.settings.template.cwd, file ) );
            });
        }).then( function () {

            srcPaths.forEach( function ( srcPath, index ) {
                self.copyFile( srcPath, destPaths[ index ] );
            });
        })
        .catch( function ( err ) {
            log.error( '', err );
        });
    },

    toID: function ( str, index, context ) {

        context = context === undefined ? index : context;

        index = isNaN( index ) ? '' : '-' + index;

        return 'sugar-' + str.replace( /\s|\/|\./g, '-' ).toLowerCase() + index;
    }
};

module.exports = function( config ) {

    new Render( config );

    return config;
};