var fs = require( 'fs' )
    , async = require( 'async' )
    , Handlebars = require( 'Handlebars' )
    , util = require( 'util' )
    , mkdirp = require( 'mkdirp' )
    , getDirName = require( 'path' ).dirname
    ;

function Render( config ) {
    
    this.config = config;
    this.templateSrc = config.settings.layout || 'demo/documentation/templates/main.hbs';
    this.customPartials = config.settings.partials || '';
    
    // default partials
    this.partialsDir = 'demo/documentation/templates/partials';
    
    if ( !config.settings.dest ) {
        
        throw new Error( 'Error: Please provide destination');
    }
    
    // required config
    this.dest = config.settings.dest + '/';
    
    this.setupHandlebars();
}

Render.prototype = {
    
    setupHandlebars: function() {
        
        // TODO: make this default or based on options obj
        var self = this;
       
        fs.readdir( self.partialsDir, function( err, files ) {
            
            Handlebars.registerHelper( 'isequal', self.isequalHelper );
            Handlebars.registerHelper( 'notequal', self.notequalHelper );
            
            self.registerPartials( self.partialsDir, files, function() {
                
                // console.log( self.customPartials);
                fs.readdir( self.customPartials, function( err, customFiles ) {
                    
                    self.registerPartials( self.customPartials, customFiles, function() {
                        
                        fs.readFile( self.templateSrc, { encoding: 'utf-8'}, function( err, data ) {
            
                            self.template = Handlebars.compile( data );
                            self.renderTemplate();
                        });
                    });
                });
            });     
        });
    },
    
    registerPartials: function( pathname, files, callback ) {
        
        async.each( files, function( filename, callback ) {
            
            var matches = /^([^.]+).hbs$/.exec( filename );
            if ( !matches ) {
                return;
            }
            var name = matches[ 1 ];
            
            // read file async and add to handlebars
            fs.readFile( pathname + '/' + filename, 'utf8', function( err, partial ) {
                
                Handlebars.registerPartial( name, partial );
                return callback( null );
            });
        }, callback );
    },
    
    renderTemplate: function() {

        var data = this.config.sections
            , compiledData = this.template( data )
            , basename = 'documentation'
            // , basename = helpers.toCamelCase( section.title )
            , path = this.dest + basename + '.html'
            ;
        // console.log( data );
        console.log( util.inspect( data, { depth:7, colors:true } ));

        this.writeFile( path, compiledData, function( err ) {
        
            if ( err ) {
                throw new Error( 'Error occurred: ', err );
            }
            else {
                console.log( 'File Complete: ', path);
            }
        });
    },
    
    isequalHelper: function ( value1, value2, options ) {

        if ( arguments.length < 3 ) {
            throw new Error( 'Handlebars Helper EQUAL needs 2 parameters' );
        }

        if ( value1 !== value2 ) {
            return options.inverse( this );
        }
        else {
            return options.fn( this );
        }
    },
    
    notequalHelper: function ( value1, value2, options ) {

        if ( arguments.length < 3 ) {
            throw new Error( 'Handlebars Helper EQUAL needs 2 parameters' );
        }

        if ( value1 === value2 ) {
            return options.inverse( this );
        }
        else {
            return options.fn( this );
        }
    },
    
    // creates directories to path name provided if directory doesn't exist, otherwise is a noop.
    writeFile: function( path, contents, callback ) {

        mkdirp( getDirName( path ), function ( err ) {
        
            if ( err ) { return callback( err ); }
            
            fs.writeFile( path, contents, callback )
      });
    }
};

module.exports = function( options ) {
    
    return new Render( options );
};