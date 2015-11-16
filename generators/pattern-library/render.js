/**
 *
 *
 *
 *
 *
 */
/*
    TODO Can this be refactored to not require a Constructor?
*/
var fs = require( 'fs' )
var util = require( 'util' );
var mkdirp = require( 'mkdirp' );
var path = require( 'path' );
var log = require( 'npmlog' );
var Handlebars = require( 'handlebars' );
var hbHelpers = require( '../../lib/hbhelpers.js' );

var defaults = {
    layoutDir: path.join( __dirname, 'templates/main.hbs'),
    partialsDir: path.join( __dirname, 'templates/partials')
};

function Render( config ) {

    this.config = config;
    this.templateSrc = config.settings.layout || defaults.layoutDir;
    this.partialsDir = defaults.partialsDir;
    this.customPartials = config.settings.partials;

    if ( !config.settings.json && !config.settings.dest ) {

        throw new Error( 'Error: Please provide destination' );
    }

    // required config
    this.dest = config.settings.dest + '/';

    this.setupFiles();

    this.setupHandlebars();

    return this.config;
}

Render.prototype = {

    setupHandlebars: function() {

        var self = this
            , helpers = hbHelpers()
            ;
        
        Handlebars.registerHelper( 'isEqual', helpers.isEqual );
        Handlebars.registerHelper( 'notEqual', helpers.notEqual );
        Handlebars.registerHelper( 'toID', helpers.toID );

        var partialsDirectories = [ this.partialsDir ];

        if ( this.customPartials ) {

            partialsDirectories.push( this.customPartials );
        }

        partialsDirectories = partialsDirectories.map( function( directory ) {

            return self.readDir( directory );
        });

        Promise.all(
            partialsDirectories
        )
        .then(
            this.assignValues.bind( this )
        )
        .then(
            this.managePartials.bind( this )
        );
    },

    assignValues: function( values ) {

        this.partials = values[ 0 ];

        if ( values[ 1 ]) {
            this.partials = this.partials.concat( values[ 1 ]);
        }
    },

    readDir: function( directory ) {

        return new Promise( function( resolve, reject ) {

            log.info( 'Registering Partials', 'from directory:', directory );

            fs.readdir( directory, function( err, files ) {

                if ( err ) {

                    throw new Error( 'Error: reading directory', err );
                }

                var partials = [];

                for ( var i = 0 ; i < files.length ; i++ ) {

                    var matches = /^([^.]+).hbs$/.exec( files[ i ] );

                    if ( matches ) partials.push( directory + '/' + files[ i ] );

                    if ( i === files.length - 1 ) resolve( partials );

                }
            });
        });
    },

    managePartials: function() {

        var self = this;

        var partials = this.partials.map( function( partial ) {

            return self.getPartials( partial );
        });

        return Promise.all(
            partials
        )
        .then(
            this.registerPartials.bind( this )
        )
        .then(
            this.readTemplate.bind( this )
        );
    },

    getPartials: function( filename ) {

        return new Promise( function( resolve, reject ) {

            fs.readFile( filename, 'utf8', function( err, partial ) {

                if ( err ) {

                    log.error( 'Error reading partial', '%j', partial, err );
                }

                var obj = {
                    file: filename,
                    data: partial
                };

                resolve( obj );

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

    readTemplate: function() {

        var self = this;

        fs.readFile( this.templateSrc, { encoding: 'utf-8'}, function( err, data ) {

            if ( err ) {

                throw new Error( 'Could not read template: ', err );
            }

            self.template = Handlebars.compile( data );
            self.renderTemplate();
        });
    },

    renderTemplate: function() {

        var data = this.config.sections
            , compiledData = this.template( data )
            , basename = 'documentation'
            , file = this.dest + basename + '.html'
            ;

        this.writeFile( file, compiledData, function( err ) {

            if ( err ) {

                throw new Error( 'Could not write file: ', err );
            }
            else {
                // console.log( 'File Complete: ', file);
                log.info( 'Template rendered:', file );
            }
        });
    },

    // creates directories to path name provided if directory doesn't exist, otherwise is a noop.
    writeFile: function( file, contents, callback ) {

        mkdirp( path.dirname( file ), function ( err ) {

            if ( err ) { return callback( err ); }

            fs.writeFile( file, contents, callback );
        });
    },

    // setupStyles: reads in the style files for the pattern library and adds them to the project so we can access them
    moveFile: function( oldFile, newFile, folder ) {

        var destination = this.dest;
        // console.log('dest', typeof this.dest);

        //read in furtive CSS
        fs.readFile( oldFile, 'utf8', function( err, data ) {

            if ( err ) throw err;

            var dir = path.join( process.cwd(), destination ); //second option should be settings: dest
            dir = path.join( dir, folder );

            if ( !fs.existsSync( dir ) ) {

                fs.mkdirSync( dir );
            }

            // console.log(data);
            fs.writeFile( newFile, data, function( err ){

                if ( err ) throw err;

                // console.log('file created!');
                log.info( 'File created', newFile );
            });
        });
    },

    setupFiles: function() {

        //furtive file paths
        var furtive = path.join( __dirname, 'templates/styles/furtive.css' );
        var newFurtive = path.join( process.cwd(), this.dest + 'styles/furtive.css' );
        //set up furtive.css
        this.moveFile( furtive, newFurtive, 'styles' );

        //patt-lib file paths
        var patLib = path.join( __dirname, 'templates/styles/pattern-lib.css' );
        var newPattLib = path.join( process.cwd(), this.dest + 'styles/pattern-lib.css' );
        //set up furtive.css
        this.moveFile( patLib, newPattLib, 'styles' );

        //furtive file paths
        var prismCSS = path.join( __dirname, 'templates/styles/prism.css' );
        var newPrismCSS = path.join( process.cwd(), this.dest + 'styles/prism.css' );
        //set up furtive.css
        this.moveFile( prismCSS, newPrismCSS, 'styles' );

        //prism.js file paths
        var prismJS = path.join( __dirname, 'templates/js/prism.js' );
        var newPrismJS = path.join( process.cwd(), this.dest + 'js/prism.js' );
        //set up prism.js
        this.moveFile( prismJS, newPrismJS, 'js' );
    }

    // renderCSS: function() {

        //get the filepaths & ext
        //if ( ext === 'scss' || ext === 'sass' ) {
            //use node sass to render scss into css (https://www.npmjs.com/package/node-sass)
            //push the css into the folder: dest/styles/ 
        //}
        // if ( ext === 'less' ) {

            //use less to render less to css (http://onedayitwillmake.com/blog/2013/03/compiling-less-from-a-node-js-script/)
        // }
    // }
};

module.exports = function( options ) {

    new Render( options );

    return options;
};