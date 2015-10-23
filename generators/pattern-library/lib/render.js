var fs = require( 'fs' )
    , async = require( 'async' )
    , Handlebars = require( 'Handlebars' )
    , helpers = require( '../../utils/utils.js' )
    ;

function Render( config ) {
    
    this.config = config;
    this.templateSrc = config.settings.template || 'demo/documentation/templates/main.hbs';
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
                this.renderTemplate( sections[ i ]);
            }
            else {
                
                throw new Error( 'Invalid Type declared for section: ', sections[ i ].title );
            }
        }
        
    },
    
    renderVariablesTemplate: function( section ) {
        // look up which template type (color or typography)
        // get info about each 
        var templateType = section.template
            , sectFiles = section.files
            , path
            , dataObjs
            , code
            ;

        if ( templateType === 'color' ) {

            var colorsInfo = [];

            sectFiles.forEach( function( file ) {

                path = file.path;
                dataObjs = file.data;

                dataObjs.forEach( function( data ) {

                    code = data.code;
                    code = code.replace(/(\r\n|\n|\r)/gm,'')
                    // console.log(code);

                    var colorStrings = [];

                    if ( path.indexOf( '.scss' ) !== -1  || path.indexOf( '.sass' ) !== -1 ) {
                        // SASS = $
                        colorStrings = code.split( '$' );
                    }

                    if ( path.indexOf( '.less' ) !== -1 ) {
                        //LESS = @
                        colorStrings = code.split( '@' );
                    }

                    //clear out any empty stings
                    colorStrings = colorStrings.filter(Boolean);

                    colorStrings.forEach( function( colorLine ) {

                        // console.log(colorLine);

                        var usageSplit = colorLine.split('//');
                        var statmentSplit = usageSplit[0].split(':');

                        colorsInfo.push({
                            'variable': statmentSplit[0],
                            'color': statmentSplit[1],
                            'usage': usageSplit[1]
                        });
                    });
                });
            });
            // console.log(colorsInfo);
            //send typeInfo to handlebars template: demo/documentation/templates/partials/color.hbs
        }

        if ( templateType === 'typography' ) {
            //get info needed
            var typeInfo = [];

            sectFiles.forEach( function( file ) {

                path = file.path;
                dataObjs = file.data;

                dataObjs.forEach( function( data ) {

                    code = data.code;

                    var typeStrings = [];

                    if ( path.indexOf( '.scss' ) !== -1 || path.indexOf( '.sass' ) !== -1 ) {
                        //SASS = $
                        typeStrings = code.match(/(\$.*:.*)/g);
                    }

                    if ( path.indexOf( '.less' ) != -1 ) {
                        //LESS = @
                        typeStrings = code.match(/(\@.*:.*)/g);
                    }

                    if ( typeStrings === null ) {
                        
                        typeStrings = [];
                    }

                    typeStrings.forEach( function( typeLine ) {

                        var varSplit = typeLine.split(':');
                        var fontSplit = varSplit[1].split(',');

                        typeInfo.push({
                            'variable': varSplit[0],
                            'font': fontSplit
                        });
                    });
                });
            });
            // console.log(typeInfo);
            //send typeInfo to handlebars template: demo/documentation/templates/partials/typography.hbs
        }

        else {

            //if we have a type variable but its not color or type, then it must be given a path to a template
            //get that path and send the data to the template
            sectFiles.forEach( function( file ) {

                dataObjs = file.data;

                dataObjs.forEach( function( data ) {

                    code = data.code;
                });
            });
            console.log(code);
            //send code to handlebars template: templateType (a path to a template the user creates)
        }
    },
    
    renderTemplate: function( section ) {

        var sections = this.config
            , compiledData = this.template( sections )
            , basename = helpers.toCamelCase( section.title )
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
}