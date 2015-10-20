var fs = require( 'fs' )
    , async = require( 'async' )
    , Handlebars = require( 'Handlebars' )
    , helpers = require( './utils' )
    ;

var Render = {
    
    config: {},
    
    init: function( config ) {
        
        this.config = config;
        
        this.setupHandlebars();
    },
    
    setupHandlebars: function() {
        
        // TODO: make this default or based on options obj
        var partialsDir = 'demo/documentation/templates/partials'
            , templateSrc = this.config.settings.template
            , self = this
            ;
       
        fs.readdir( partialsDir, function( err, files ) {
            
            // register all partials
            async.each( files, function( filename, callback ) {
                
                var matches = /^([^.]+).hbs$/.exec( filename );
                if ( !matches ) {
                    return;
                }
                var name = matches[ 1 ];
                
                // read file async and add to handlebars
                fs.readFile( partialsDir + '/' + filename, 'utf8', function( err, partial ) {
                    
                    Handlebars.registerPartial( name, partial );
                    return callback( null );
                });
                
            }, function() {
                
                // read template file
                fs.readFile( templateSrc, { encoding: 'utf-8'}, function( err, data ) {
            
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
                
                console.log( 'Invalid Type declared for section: ', sections[ i ].title );
            }
        }
        
    },
    renderVariablesTemplate: function( section ) {
        // look up which template type (color or typography)
        // get info about each 
        var templateType = section.template;

        if ( templateType === 'color' ) {

            var colorsInfo = [];
            var path;
            
            //get the info needed for template
            for ( var i = 0; i < section.files.length; i++ ) {

                path = section.files[i].path;
                
                for ( var j = 0; j < section.files[i].data.length; j++ ) {

                    var code = section.files[i].data[j].code;
                    //remove new line characters from code
                    code = code.replace(/(\r\n|\n|\r)/gm,'');

                    var colorStrings = [];

                    //test the path to see what extension it is
                    if ( path.indexOf( '.scss' ) != -1 || path.indexOf( '.sass' ) != -1 ) {
                        //SASS = $
                        colorStrings = code.split( '$' );
                    }

                    if ( path.indexOf( '.less' ) != -1 ) {
                        //LESS = @
                        colorStrings = code.split( '@' );
                    }

                    if ( path.indexOf( '.css' ) != -1 ) {
                        //CSS = no variables
                    }

                    //clear out any empty stings
                    colorStrings = colorStrings.filter(Boolean);
                    
                    for ( var k = 0; k < colorStrings.length; k++ ) {

                        var usageSplit = colorStrings[k].split('//');
                        var statmentSplit = usageSplit[0].split(':');

                        colorsInfo.push({
                            'variable': statmentSplit[0],
                            'color': statmentSplit[1],
                            'usage': usageSplit[1]
                        });
                    }
                }   
            }
            // console.log(colorsInfo);
        }

        if ( templateType === 'typography' ) {
            //get info needed
            var typeInfo = [];
            var path;

            for ( var i = 0; i < section.files.length; i++ ) {

                path = section.files[i].path;

                for ( var j = 0; j < section.files[i].data.length; j++ ) {
                    
                    var code = section.files[i].data[j].code;
                    
                    var typeStrings = [];

                    if ( path.indexOf( '.scss' ) != -1 || path.indexOf( '.sass' ) != -1 ) {
                        //SASS = $
                        typeStrings = code.match(/(\$.*:.*)/g);
                    }

                    if ( path.indexOf( '.less' ) != -1 ) {
                        //LESS = @
                        typeStrings = code.match(/(\@.*:.*)/g);
                    }

                    if ( path.indexOf( '.css' ) != -1 ) {
                        //CSS = no variables
                    }

                    if ( typeStrings === null ) {
                        
                        typeStrings = [];
                    }

                    //now split the lines up to get each particular section (var, types)
                    for ( var k = 0; k < typeStrings.length; k++ ) {

                        var varSplit = typeStrings[k].split(':');
                        var fontSplit = varSplit[1].split(',');

                        typeInfo.push({
                            'variable': varSplit[0],
                            'font': fontSplit
                        });
                    }
                }
            }
            // console.log( typeInfo );
        }
    },
    
    renderTemplate: function( section ) {

        var sections = this.config
            , Handlebars = require( 'handlebars' )
            , templateSrc = this.config.settings.template
            , dest = this.config.settings.dest + '/'
            , self = this
            ;

        fs.readFile( templateSrc, { encoding: 'utf-8' }, function( err, data ) {

            var page = Handlebars.compile( data )
                , data = self.template( sections )
                , basename = helpers.toCamelCase( section.title )
                , path = dest + basename + '.html'
                ;

            helpers.writeFile( path, data, function( err ) {
            
                if ( err ) {
                    console.log( 'Error occurred: ', err );
                }
            });
        });
    }
};

module.exports = Render;