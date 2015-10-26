var fs = require( 'fs' )
    , async = require( 'async' )
    , Handlebars = require( 'Handlebars' )
    , helpers = require( '../../utils/utils.js' )
    , util = require( 'util' )
    ;

function Render( config ) {
    
    this.config = config;
    this.templateSrc = config.settings.layout || 'demo/documentation/templates/main.hbs';
    this.partialsDir = config.settings.partialsDir || 'demo/documentation/templates/partials';
    
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
            
            // register all partials
            async.each( files, function( filename, callback ) {
                
                var matches = /^([^.]+).hbs$/.exec( filename );
                if ( !matches ) {
                    return;
                }
                var name = matches[ 1 ];
                
                // read file async and add to handlebars
                fs.readFile( self.partialsDir + '/' + filename, 'utf8', function( err, partial ) {
                    
                    Handlebars.registerPartial( name, partial );
                    return callback( null );
                });
                
            }, function() {
                
                // read template file
                fs.readFile( self.templateSrc, { encoding: 'utf-8'}, function( err, data ) {
            
                    self.template = Handlebars.compile( data );
                    self.renderFiles();
                });
            });            
        });
    },
    
    renderFiles: function() {
        
        var sections = this.config.sections;
        
        //Check what type a section is, then route them accordingly
        for ( var i = 0; i < sections.length; i++ ) {
            
            // special type variables needs to read in sass or less file, then spit out layout
            if ( sections[ i ].type !== 'variables' && sections[ i ].type ) {
                
                throw new Error( 'Invalid Type declared for section: ', sections[ i ].title );
            }
        }
        
        this.renderTemplate( sections );
        
    },
    
    renderTemplate: function( section ) {

        var compiledData = this.template( section )
            , basename = 'documentation'
            // , basename = helpers.toCamelCase( section.title )
            , path = this.dest + basename + '.html'
            ;

        helpers.writeFile( path, compiledData, function( err ) {
        
            if ( err ) {
                console.log(err);
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
    }
};

module.exports = function( options ) {
    
    return new Render( options );
};