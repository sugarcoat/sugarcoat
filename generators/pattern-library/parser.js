/**
 * 
 * Takes a section object with title key and files string or array and returns the parsed comments
 *
 */

var util = require( 'util' );
var log = require( 'npmlog' );
var beautify_html = require( 'js-beautify' ).html;
var commentParser = require( 'comment-parser' );
var parserFunctions = commentParser.PARSERS;

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
    
    parseComment: function( currentFile, data, type, templateType ) {
        
        log.info( 'Parsing Comments', currentFile );
        
        var isHtmlComponent = false;
        
        if ( data.indexOf( '<!--' ) > -1 ) {
            
            isHtmlComponent = true;
        }
        
        var comments = data.split( '/**' )
            , COMMENTSPLIT = /^\s*\*\//m
            // for html, include trailing comment
            , HTMLCOMMENTSPLIT = /^\s*\*\/\n*\s*-->/m
            ;
        
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
                var lastCommentBlock = block[ 1 ].lastIndexOf( '<!--' );
                
                if ( lastCommentBlock > -1 ) {

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

                        // beautify code
                        block[ 1 ] = beautify_html( currentComment.description );
                    }
                }
            }
            // add code to data obj
            comments[ i ].code = block[ 1 ];
            
            var infostr = '[' + templateType + '] for: ' + currentFile;

            if ( type ) {

                var variableInfo = this.parseVarCode( comments[i].code, currentFile );

                if ( templateType === 'typography' ) {

                    //break down fonts into an array
                    variableInfo.forEach( function( variableLine ){

                        var fonts = variableLine.value;
                        var values = fonts.match(/\'([\w\s]+)\'/g);
                        variableLine.value = values;
                    });
                }

                //set template code that has been serialized to serializedCode
                comments[i].serializedCode = variableInfo;

                //log out info about serialized code
                log.info( 'Serialized Code Created', infostr );

            }

        }
        
        return comments;
    },

    parseVarCode: function( code, path ) {

        var infoArray = []
            , infoStrings = []
            ;

        if ( path.indexOf( '.scss' ) !== -1  || path.indexOf( '.sass' ) !== -1 ) {
            // SASS = $        
            infoStrings = code.match(/(\$.*:.*)/g);
        }

        if ( path.indexOf( '.less' ) !== -1 ) {
            //LESS = @
            infoStrings = code.match(/(\@.*:.*)/g);
        }

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
        
        return infoArray;
    }
};

module.exports = function() {
    return new Parser();
};