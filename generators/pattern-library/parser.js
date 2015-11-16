/**
 *
 * Takes a section object with title key and files string or array and returns the parsed comments
 *
 */
/*
    TODO Can this be refactored to not require a Constructor?
*/
var util = require( 'util' );
var _ = require( 'lodash' );

var log = require( '../../lib/logger' );
var beautify_html = require( 'js-beautify' ).html;
var commentParser = require( 'comment-parser' );
var parserFunctions = commentParser.PARSERS;

var rModifier = /([:\.#][\w-]+\s)/;
var rCommentBlock = /(<!--[\n|\s]*\/\*\*)/g;
var rCommentSplit = /^\s*\*\//m;
var rHtmlCommentSplit = /^\s*\*\/\n*\s*-->/m;

function Parser( config ) {

    log.config( config.settings.log );
}

Parser.prototype = {

    customParsers: {
        parsers: [

            parserFunctions.parse_tag,

            function( str, data ) {

                var string = str;
                str = '';

                if ( data.tag === 'modifier' ) {

                    // var modifier = /([:\.#][\w-]+\s)/;
                    var match = string.split( rModifier );

                    if ( match.length > 1 ) {

                        data.name = match[ 1 ];

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

        //test for html comment start, that will tell us it is an html file that we will be parsing
        if ( data.indexOf( '<!--' ) > -1 ) {

            isHtmlComponent = true;

            //find out how many comment blocks there are
            blockCount = ( ( data.match( rCommentBlock ) || [] ).length ) - 1;
        }

        //split the data at the beginning of the comment block
        var comments = data.split( '/**' );

        comments.shift();

        //loop through each commentblock
        for ( var i = 0; i < comments.length; i++ ) {

            // split blocks into comment and code content
            var block = isHtmlComponent ?
                    comments[ i ].split( rHtmlCommentSplit ) : comments[ i ].split( rCommentSplit )
                , toParse = '/**' + block[ 0 ] + ' */'
                ;

            // add add parsed comment to array
            comments[ i ] = commentParser( toParse, this.customParsers )[ 0 ];

            if ( isHtmlComponent ) {

                //find out if there is a last opening html comment block
                var lastCommentBlock = block[ 1 ].lastIndexOf( '<!--' );

                // if there's a following comment block, remove the starting html comment
                if ( lastCommentBlock > -1 && blockCount !== i ) {

                    block[ 1 ] = block[ 1 ].slice( 0, lastCommentBlock );
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
                        currentComment.description = beautify_html( currentComment.description, { indent_size: 2 } );
                    }
                }
            }

            // add code to data obj as 'context'
            comments[ i ].context = _.trim( block[ 1 ] );

            var infostr = '[' + templateType + '] for: ' + currentFile;

            if ( type ) {

                var variableInfo = this.parseVarCode( comments[i].context, currentFile );

                if ( templateType === 'typography' ) {

                    //break down fonts into an array
                    variableInfo.forEach( function( variableLine ){

                        var fonts = variableLine.value;
                        var values = fonts.match(/\'([\w\s]+)\'/g);
                        variableLine.value = values;
                    });
                }

                //add serializedCode to data obj as 'serializedCode'
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

module.exports = function( config ) {
    return new Parser( config );
};