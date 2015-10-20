//TODO: Config obj location
var configLocation = './notes/patterns-config';

var fs = require( 'fs' )
    , configFile = require( configLocation )
    , util = require( 'util' )
    , glob = require("glob")
    , async = require( 'async' )
    , commentParser = require( 'comment-parser' )
    , Handlebars = require( 'handlebars' )
    , path = require( 'path' )
    , mkdirp = require( 'mkdirp' )
    , getDirName = require( 'path' ).dirname
    ;

/**
 * 
 * Utility Functions
 *
 */
// creates directories to path name provided if directory doesn't exist, otherwise is a noop.
function writeFile( path, contents, cb ) {
    
    mkdirp(getDirName(path), function (err) {
        if (err) return cb(err)
        fs.writeFile(path, contents, cb)
  });
}
// replaces string to camelCase string
function toCamelCase( str ) {
    
    var str = str.replace( /\w\S*/g,
        function( txt ){
            
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }).replace( /\s+/g, '');

    return str.charAt(0).toLowerCase() + str.slice(1);
}

// run in the terminal using `node index.js`
var Patterns = {

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

        for ( var i = 0, l = data[key].sections.length; i < l; i++ ) {
            var sectObjs = data[key].sections[i];
            var ObjFiles = sectObjs.files;
            // console.log(sectObjs);

            if ( ObjFiles.indexOf( '*' ) > -1 ) {

                // files = glob.sync( ObjFiles, { nodir: true, matchBase:true } );
                files = glob.sync( ObjFiles );
                data[key].sections[i].files = files;
                // console.log('I have a star', ObjFiles);
            }
            else {
                var suffix = '/';
                var suffixLength = suffix.length;
                var filesLength = ObjFiles.length;
                // console.log('obj length', filesLength);
                var slashEnd = ObjFiles.indexOf( suffix, ( filesLength - suffixLength ) );
                if( slashEnd === filesLength - 1) {
                    // console.log('we have and end match!', ObjFiles);
                    files = glob.sync( ObjFiles+'**/*' );
                    data[key].sections[i].files = files;
                }
            }
        }
        
        this.parseFiles();
    },
    
    parseFiles: function() {
        
        var sections = this.configObj.patterns.sections
            , self = this
            ;
        
        async.each( sections, this.parseSection.bind( Patterns ), function() {
            
            self.configObj.patterns.sections = sections;
            
            // console.log( util.inspect( sections, { depth:5, colors:true } ));
            self.setupHandlebars();

        });
    },
    
    parseSection: function( section, callback ) {
        
        var self = this
            , originalFiles = section.files
            , hasVariables = section.variables
            ;
        
        section.files = [];
        
        // only one file 
        if ( typeof originalFiles === 'string' ) {
            
            var currentFile = section.files;
            
            fs.readFile( currentFile, 'utf-8', function( err, data ) {
                                
                section.files.push( self.parseComment( currentFile, data ));
                
                return callback( null );
            });
        }
        // array of files
        else {
        
            async.each( originalFiles,
                function( currentFile, callback ) {
                    
                    var match;
                    
                    if ( hasVariables ) {
                        
                        for ( var i = 0; i < hasVariables.length ; i++ ) {
                            
                            if ( hasVariables[ i ].files === currentFile ) {
                                
                                match = hasVariables[ i ];
                            }
                        }
                    }
                    
                    // read all files
                    fs.readFile( currentFile, { encoding: 'UTF8'}, function( err, data ) {
                        
                        section.files.push( self.parseComment( currentFile, data, match ));
                        
                        // read file callback
                        return callback( null );
                    });
                },
                function( err ) {
                    
                    // parent callback
                    return callback( null );
                }
            );
        }
    },
    
    parseComment: function( currentFile, data, type ) {
        
        console.log( type );
        
        var COMMENTSPLIT = /^\s*\*\//m
            // for html, include trailing comment
            , HTMLCOMMENTSPLIT = /^\s*\*\/\n-->/m
            , isHtmlComponent = false
            // grab each comment block
            , comments = data.split( '/**' )
            ;
        
        // the first array item is empty if not an html component
        if ( comments[ 0 ].length !== 0 ) {
            
            isHtmlComponent = true;
        }
        
        comments.shift();
        
        for ( var i = 0; i < comments.length; i++ ) {
            
            // split blocks into comment and code content
            var block = isHtmlComponent 
                ? comments[ i ].split( HTMLCOMMENTSPLIT )
                : comments[ i ].split( COMMENTSPLIT ) 
                , toParse = '/**' + block[ 0 ] + ' */'
                ;
            
            // add comment section to array
            comments[ i ] = commentParser( toParse )[ 0 ];
            
            if ( isHtmlComponent ) {
                
                // if there's a following comment block, remove the starting html comment
                var lastCommentBlock = block[ 1 ].lastIndexOf( '<!--' )
                    , isLastComment = block[ 1 ].length - lastCommentBlock === 5
                    ;
                
                if ( isLastComment ) {
                    block[ 1 ] = block[ 1 ].slice(0, lastCommentBlock );
                }
            }
            // add code to data obj
            comments[ i ].code = block[ 1 ];
        }

        return {
            path: currentFile,
            data: comments
        };
        
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
            console.log(colorsInfo);
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
            console.log( typeInfo );
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
                , basename = toCamelCase( section.title )
                , path = dest + basename + '.html'
                ;

            writeFile( path, data, function( err ) {
            
                if ( err ) {
                    console.log( 'Error occurred: ', err );
                }
            });
        });
    }
};

module.exports = Patterns.init();