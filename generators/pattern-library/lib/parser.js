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
    
    parseComment: function( currentFile, data, templateType ) {
        
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

                        // beautify code
                        block[ 1 ] = beautify_html( currentComment.description );
                    }
                }
            }
            // add code to data obj
            comments[ i ].code = block[ 1 ];

            if ( templateType === 'color' ) {

                var colorsInfo = [];
                
                colorsInfo = this.parseVarCode( comments[i].code, currentFile );

                comments[i].serializedCode = colorsInfo;
                // console.log(comments[i]);
            }

            if ( templateType === 'typography' ) {

                var typeInfo = [];

                typeInfo = this.parseVarCode( comments[i].code, currentFile );

                typeInfo.forEach( function( typeLine ){

                    var fonts = typeLine.value;
                    var values = fonts.match(/\'([\w\s]+)\'/g);
                    typeLine.value = values;
                });

                comments[i].serializedCode = typeInfo;
                // console.log(comments[i]);
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