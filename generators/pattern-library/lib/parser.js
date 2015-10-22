var async = require( 'async' )
    , fs = require( 'fs' )
    , commentParser = require( 'comment-parser' )
    ;
/**
 * 
 * Takes a section object with title key and files string or array and returns the parsed comments
 *
 */
function Parser() {};

Parser.prototype = {
    
    parseSection: function( section, callback ) {
        
        var self = this
            , originalFiles = section.files
            ;
        
        section.files = [];
        
        // only one file 
        if ( typeof originalFiles === 'string' ) {
            
            var currentFile = originalFiles;
            
            fs.readFile( currentFile, 'utf-8', function( err, data ) {
                                
                section.files.push( self.parseComment( currentFile, data ));
                
                return callback( null );
            });
        }
        
        // array of files
        else {
            async.each( originalFiles,
                function( currentFile, callback ) {
                    
                    // read all files
                    fs.readFile( currentFile, { encoding: 'UTF8'}, function( err, data ) {
                        
                        section.files.push( self.parseComment( currentFile, data ));
                        
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
    }
};

module.exports = new Parser();