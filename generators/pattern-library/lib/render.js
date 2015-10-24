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
            if ( sections[ i ].type === 'variables' ) {
                
                this.renderVariablesTemplate(sections[ i ]);
                
            }
            else if ( !sections[ i ].type ) {
                
                //do normal rendering on array of files
                // this.renderTemplate( sections[ i ]);
            }
            else {
                
                throw new Error( 'Invalid Type declared for section: ', sections[ i ].title );
            }
        }
        this.renderTemplate( sections );
        
    },
    
    renderVariablesTemplate: function( section ) {
 
        var templateType = section.template
            , sectFiles = section.files
            , path
            , dataObjs
            , code
            ;

        if ( templateType === 'color' ) {

            var colorsInfo = [];

            colorsInfo = this.parseVarData( sectFiles );
            // section.variableSrc = colorsInfo;
            
            // console.log(colorsInfo);

            // this.renderTemplate( section );
            //send typeInfo to handlebars template: demo/documentation/templates/partials/color.hbs
        }

        if ( templateType === 'typography' ) {
            //get info needed
            var typeInfo = [];

            //send typeInfo to handlebars template: demo/documentation/templates/partials/typography.hbs

            typeInfo = this.parseVarData( sectFiles );

            // console.log(typeInfo);
        }

        else {

            var unknownInfo = [];

            unknownInfo = this.parseVarData( sectFiles );

            // console.log(unknownInfo);
        }
    },

    parseVarData: function( sectionFiles ) {

        var infoArray = []
            , path 
            , code
            ;

        sectionFiles.forEach( function( file ) {

            path = file.path;
            dataObjs = file.data;

            dataObjs.forEach( function( data ) {

                var infoStrings = [];

                code = data.code;
                // console.log(code);

                if ( path.indexOf( '.scss' ) !== -1  || path.indexOf( '.sass' ) !== -1 ) {
                    // SASS = $
                    // colorStrings = code.split( '$' );
                    infoStrings = code.match(/(\$.*:.*)/g);
                    // console.log(infoStrings);
                }

                if ( path.indexOf( '.less' ) !== -1 ) {
                    //LESS = @
                    infoStrings = code.match(/(\@.*:.*)/g);
                }

                if ( infoStrings === null ) {
                        
                    typeStrings = [];
                }
                
                //clear out any empty stings
                // infoStrings = infoStrings.filter( Boolean );

                infoStrings.forEach( function( infoLine ) {

                    var usageSplit = infoLine.split( '//' );
                    var statmentSplit = usageSplit[0].split( ':' );

                    if ( usageSplit[1] !== undefined ) {

                        infoArray.push({
                            'variable': statmentSplit[0],
                            'value': statmentSplit[1],
                            'comment': usageSplit[1]
                        });
                    }

                    else {

                        infoArray.push({
                            'variable': statmentSplit[0],
                            'value': statmentSplit[1]
                        });
                    }
                });
            });
        });
        return infoArray;
    },
    
    renderTemplate: function( section ) {

        var compiledData = this.template( section )
            , basename = 'documentation'
            // , basename = helpers.toCamelCase( section.title )
            , path = this.dest + basename + '.html'
            ;

        helpers.writeFile( path, compiledData, function( err ) {
        
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
    }
};

module.exports = function( options ) {
    
    return new Render( options );
};