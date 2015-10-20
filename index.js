var configLocation = './notes/example-config';

var fs = require( 'fs' )
    , configFile = require( configLocation )
    , util = require( 'util' )
    , glob = require("glob")
    , async = require( 'async' )
    , Handlebars = require( 'handlebars' )
    , path = require( 'path' )
    , helpers = require( './generators/pattern-library/lib/utils' )
    , parser = require( './generators/pattern-library/lib/parser' )
    ;

// run in the terminal using `node index.js`
var Generators = {

    configObj: {},
    
    template: null,
    
    init: function( options ) {
        
        this.readFile();
    },
    
    readFile: function() {
        
        //get the data and throw it into a variable we can edit
        this.configObj = configFile;
        
        // TODO: need to execute get files on the parameter only, not through the whole obj
        this.getFiles( this.configObj );
        
    },
    
    getFiles: function( data ) {

        var files;

        var key = Object.keys( data );

        for ( var i = 0; i < key.length; i++ ){

            for ( var j = 0; j < data[key[i]].sections.length; j++ ) {
                
                var sectObjs = data[key[i]].sections[j];
                var objFiles = sectObjs.files;
                
                data[key[i]].sections[j].files = this.getGlob( objFiles );
            }
        }
        
        this.parseFiles();
    },
    
    getGlob: function( objFiles ) {
        
        if( objFiles instanceof Array ) {

            var tempFiles = [];

            for ( var k = 0; k < objFiles.length; k++ ) {
                
                if ( objFiles[k].indexOf( '*' ) > -1 ) {

                    files = glob.sync( objFiles[k] );
                    // data[key[i]].sections[j].files[k] = files;
                   for ( l = 0; l < files.length; l++ ) {

                        tempFiles.push(files[l]);
                        // console.log('file', files[l]);
                    }
                }

                else {
                    var suffix = '/';
                    var suffixLength = suffix.length;
                    var filesLength = objFiles[k].length;
                    var slashEnd = objFiles[k].indexOf( suffix, ( filesLength - suffixLength ) );
                    
                    if( slashEnd === filesLength - 1) {
                        // console.log('we have and end match!', objFiles[k]);
                        files = glob.sync( objFiles[k]+'**/*', { nodir: true, matchBase:true } );
                        
                        for ( m = 0; m < files.length; m++ ) {
                            
                            tempFiles.push(files[m]);
                        }
                    }
                    else {
                        tempFiles.push(objFiles[k]);
                    }
                }
            } 
            return tempFiles;
            // console.log(tempFiles);
            // data[key[i]].sections[j].files = tempFiles;      
        }

        if ( objFiles.indexOf( '*' ) > -1 ) {

            // files = glob.sync( objFiles, { nodir: true, matchBase:true } );
            files = glob.sync( objFiles );
            return files;
            // console.log('I have a star', objFiles);
        }

        else {
            var suffix = '/';
            var suffixLength = suffix.length;
            var filesLength = objFiles.length;
            var slashEnd = objFiles.indexOf( suffix, ( filesLength - suffixLength ) );
            
            if( slashEnd === filesLength - 1) {
                // console.log('we have and end match!', objFiles);
                files = glob.sync( objFiles+'**/*' );
                
                return files;
            }
            else {
                return objFiles;
            }
            
        }
    },
    
    parseFiles: function() {
        
        var sections = this.configObj.patterns.sections
            , self = this
            ;
        
        async.each( sections, parser.parseSection.bind( parser ), function() {
            // console.log( 'sections', arguments );
            
            self.configObj.patterns.sections = sections;
            
            // console.log( util.inspect( sections, { depth:5, colors:true } ));
            // self.setupHandlebars();

        });
    },

    renderFiles: function() {
        
        var config = this.configObj.patterns
            , sections = config.sections
            ;
        
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
    
    setupHandlebars: function() {
        
        // TODO: make this default or based on options obj
        var partialsDir = 'demo/documentation/templates/partials'
            , templateSrc = this.configObj.patterns.settings.template
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

        var sections = this.configObj.patterns
            , Handlebars = require( 'handlebars' )
            , templateSrc = this.configObj.patterns.settings.template
            , dest = this.configObj.patterns.settings.dest + '/'
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

module.exports = Generators.init();