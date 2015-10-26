var async = require( 'async' );
var fs = require( 'fs' );
var util = require( 'util' );
var commentParser = require( 'comment-parser' );
var parserFunctions = commentParser.PARSERS;
var beautify_html = require( 'js-beautify' ).html;

/**
 * 
 * Takes a section object with title key and files string or array and returns the parsed comments
 *
 */
function Parser() {}

Parser.prototype = {
    
    customParsers: {
        parsers: [
            
            parserFunctions.parse_tag,
            
            function( str, data ) {
                
                var string = str;
                str = '';
                
                if ( data.tag === 'modifier' ) {
                    
                    var modifier = /([:\.#][\w-]+\s)/;
                    var match = string.split( modifier );
                    // console.log( str, match );
                    
                    if ( match.length > 1 ) {
                        
                        data.name = match[ 1 ];
                        // console.log( match );
                        str = match[ 1 ];
                    }
                }

                return {
                    source: str,
                    data: data
                };
            },
            // parserFunctions.parse_type,
            // parserFunctions.parse_name,
            parserFunctions.parse_description
        ]
    },
    
    parseSection: function( section, callback ) {
        
        var self = this
            , originalFiles = section.files
            ;
        
        section.files = [];
        
        // only one file 
        if ( typeof originalFiles === 'string' ) {
            
            var currentFile = originalFiles;
            
            fs.readFile( currentFile, 'utf-8', function( err, data ) {
                                
                section.files.push( self.parseComment( currentFile, data ) );
                
                return callback( null );
            });
        }
        
        // array of files
        else {
            async.each( originalFiles,
                function( currentFile, callback ) {
                    
                    // read all files
                    fs.readFile( currentFile, { encoding: 'UTF8'}, function( err, data ) {
                        
                        section.files.push( self.parseComment( currentFile, data ) );
                        
                        // console.log( util.inspect( section, { depth:7, colors:true } ));
                        
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
    
    parseComment: function( currentFile, data ) {
        
        var isHtmlComponent = false
            // grab each comment block
            , comments = data.split( '/**' )
            , COMMENTSPLIT = /^\s*\*\//m
            // for html, include trailing comment
            , HTMLCOMMENTSPLIT = /^\s*\*\/\n-->/m
            ;
        
        // the first array item is empty if not an html component
        if ( comments[ 0 ].length !== 0 ) {
            
            isHtmlComponent = true;
        }
        
        comments.shift();
        
        for ( var i = 0; i < comments.length; i++ ) {
            
            // split blocks into comment and code content
            var block = isHtmlComponent ? 
                    comments[ i ].split( HTMLCOMMENTSPLIT ) : comments[ i ].split( COMMENTSPLIT ) 
                , toParse = '/**' + block[ 0 ] + ' */'
                ;
            
            // add comment section to array

            comments[ i ] = commentParser( toParse, this.customParsers )[ 0 ];
            
            if ( isHtmlComponent ) {

                // if there's a following comment block, remove the starting html comment
                var lastCommentBlock = block[ 1 ].lastIndexOf( '<!--' )
                    , isLastComment = block[ 1 ].length - lastCommentBlock === 5
                    ;

                if ( isLastComment ) {
                    block[ 1 ] = block[ 1 ].slice(0, lastCommentBlock );
                }
            }
            // check if tags has a example tag
            else {

                var currentComments = comments[ i ].tags;

                for ( var j = 0; j < currentComments.length; j++ ) {
                    
                    var currentComment = currentComments[ j ];

                     // tag has an example description with html markup
                    if ( currentComment.tag === 'example' ) {

                    // add name and descr together to make code
                    // var content = currentComment.name + ' ' + currentComment.description;

                        // beautify code
                        block[ 1 ] = beautify_html( currentComment.description );
                    }
                }
            }
            // add code to data obj
            comments[ i ].code = block[ 1 ];
        }

        // console.log(comments[0].code);
        // console.log(currentFile);

        return {
            path: currentFile,
            data: comments
        };
    },

    parseVarCode: function( code ) {


    }
};

module.exports = function() {
    return new Parser();
};