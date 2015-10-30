var fs = require( 'fs' )
    , Handlebars = require( 'Handlebars' )
    , util = require( 'util' )
    , mkdirp = require( 'mkdirp' )
    , path = require( 'path' )
    , log = require( 'npmlog' )
    ;

function Render( config ) {

    this.config = config;
    this.templateSrc = config.settings.layout || 'generators/pattern-library/templates/main.hbs';
    this.customPartials = config.settings.partials;
    
    // default partials
    this.partialsDir = 'generators/pattern-library/templates/partials';
    
    if ( !config.settings.dest ) {
        
        throw new Error( 'Error: Please provide destination');
    }
    
    // required config
    this.dest = config.settings.dest + '/';
    this.setupHandlebars();
}

Render.prototype = {
    
    setupHandlebars: function() {
        
        var self = this;
        
        Handlebars.registerHelper( 'isequal', this.isequalHelper );
        Handlebars.registerHelper( 'notequal', this.notequalHelper );
        
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
    
    isequalHelper: function ( value1, value2, options ) {

        if ( arguments.length < 3 ) {
            
            log.error( 'Handlebars Helper EQUAL needs two parameters' );
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
            
            log.error( 'Handlebars Helper EQUAL needs two parameters' );
        }

        if ( value1 === value2 ) {
            return options.inverse( this );
        }
        else {
            return options.fn( this );
        }
    },
    
    // creates directories to path name provided if directory doesn't exist, otherwise is a noop.
    writeFile: function( file, contents, callback ) {

        mkdirp( path.dirname( file ), function ( err ) {
        
            if ( err ) { return callback( err ); }
            
            fs.writeFile( file, contents, callback );
        });
    }
};

module.exports = function( options ) {
    
    return new Render( options );
};