var configLocation = './notes/example-patterns-config';

var fs = require( 'fs' )
    , util = require( 'util' )
    , configFile = require( configLocation )
    , css = require( 'css' )
    , example = require( './notes/example-config')
    , async = require( 'async' )
    , commentParser = require( 'comment-parser' )
    ;
// run in the terminal using `node index.js`
module.exports = {

    configObj: {},
    
    init: function( options ) {
        
        this.readFile();
        
    },
    
    readFile: function() {
        //get the data and throw it into a variable that we can use to edit
        this.configObj = configFile;
        
        this.getFiles( this.configObj );
        // console.log(this.configObj);
    },
    
    getFiles: function( data ) {

        var files;
       
        var glob = require("glob");

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
        
        async.each( sections, this.parseFile, function() {
            
            
            self.configObj.patterns.sections = sections;

            self.renderFiles();
            
            // console.log( 'DONE!', util.inspect( sections, { depth: 5, colors:true } ));

        });
    },
    parseFile: function( section, callback ) {
        
        var COMMENTSPLIT = /^\s*\*\//m;
        // for html, include trailing comment
        var HTMLCOMMENTSPLIT = /^\s*\*\/\n-->/m;
        
        //internal function that parses using comment-parse on currentFile
        function parseComment( currentFile, data ) {
            
            var isHtmlComponent = false;
            
            // grab each comment block
            var comments = data.split( '/**' );
            
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
        }

        // only one file declared
        if ( typeof section.files === 'string' ) {
            
            var currentFile = section.files;
            
            fs.readFile( currentFile, { encoding: 'UTF8' }, function( err, data ) {
                
                section.files = [];
                section.files.push( parseComment( currentFile, data ));
                
                return callback( null );
            });
        }
        else {
            
            // array of files declared
            var files = section.files;
            section.files = [];
            
            async.each( files,
                function( item, callback ) {
                    
                    var currentFile = item;
                    
                    // read all files
                    fs.readFile( currentFile, { encoding: 'UTF8'}, function( err, data ) {
                        
                        section.files.push( parseComment( currentFile, data ));
                        
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
    
    renderFiles: function() {
        
        var config = this.configObj.patterns
            , sections = config.sections
            ;
        
        //Check what type a section is, then route them accordingly
        for ( var i = 0; i < sections.length; i++ ) {
            
            // special type variables needs to read in sass or less file, then spit out layout
            if ( sections[ i ].type === 'variables' ) {
                
                this.renderVariablesTemplate();
                
            }
            else if ( !sections[ i ].type ) {
                
                //do normal rendering on array of files
                this.renderTemplate();
            }
            else {
                
                console.log( 'Invalid Type declared for section: ', sections[ i ].title );
            }
        }
        
    },
    
    renderVariablesTemplate: function() {
        // look up which template type (color or typography)
    },
    
    renderTemplate: function() {
        
        var assemble = require( 'assemble' );
        // console.log( assemble );
        assemble.task( 'default', function() {
            assemble.src( this.configObj.patterns.settings.template )
                .pipe( extname())
                .pipe( assemble.dest( 'dist/'));
        });
        
        // var Handlebars = require( 'handlebars' );
        // var templateSrc = this.configObj.patterns.settings.template;
        // var sections = this.configObj.patterns;
        //
        // fs.readFile( templateSrc, { encoding: 'utf-8'}, function( err, data ) {
        //
        //     var page = Handlebars.compile( data );
        // });
    }
};

module.exports.init();