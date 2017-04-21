/**
 * Takes a section object with title key and files string or array and returns the parsed comments
 */
/*
    TODO Can this be refactored to not require a Constructor?
*/

'use strict';

// var log = require( './logger' );
var serializer = require( 'comment-serializer' );
var mySerializer = serializer({
    parsers: serializer.parsers()
});

function Parser( config ) {

    // log.config( config.settings.log );
}

Parser.prototype = {

    parseComment: function ( currentFile, data, mode, templateType ) {

        // TODO: find another way display this info to the user, or remove all together?
        // log.info( 'Parse', currentFile );

        var serialized = mySerializer( data );

        // serializer error handling
        var hasErrors = serialized.some( comment => {

            return comment.tags.some( tag => {

                return tag.error;
            });
        });

        if ( hasErrors ) {

            var serializedErrors = serialized.map( comment => {

                return comment.tags.find( tag => {

                    return tag.error;
                });
            });

            return serializedErrors[0].error;
        }
        else {
            for ( var i = 0; i < serialized.length; i++ ) {

                if ( mode === 'variable' ) {

                    serialized[ i ].serializedCode = this.parseVarCode( serialized[ i ].context, currentFile );
                }

                var context = serialized[ i ].context;

                // check if context is html. it will have an ending comment block in it
                var match = /-->\n*/.exec( context );

                if ( match ) {

                    var html = context.substring( 4 );

                    serialized[ i ].context = html;
                }
            }

            return serialized;
        }
    },

    parseVarCode: function ( code, path ) {

        var infoArray = []
            , infoStrings = []
            ;

        if ( path.indexOf( '.scss' ) !== -1  || path.indexOf( '.sass' ) !== -1 ) {
            // SASS = $
            infoStrings = code.match(/(\$.*:.*)/g);
        }

        if ( path.indexOf( '.less' ) !== -1 ) {
            // LESS = @
            infoStrings = code.match(/(\@.*:.*)/g);
        }

        if ( path.indexOf( '.css' ) !== -1 ) {
            // CSS = --
            infoStrings = code.match(/(--.*:.*)/g);
        }

        if ( !infoStrings ) return;

        infoStrings.forEach( ( infoLine ) => {
            /*
             * $var: #fff; //something
             * $var: #000; /* etc **/

            var line = {}
                , variableSplit = infoLine.split(':')
                ;

            line.variable = variableSplit[ 0 ];

            var dashComment = variableSplit[ 1 ].split( '//' );
            var starComment = variableSplit[ 1 ].split( '/*' );

            if ( dashComment[ 1 ] !== undefined ) {

                line.value = dashComment[ 0 ].trim();
                line.comment = dashComment[ 1 ].trim();
            }
            else if ( starComment[ 1 ] !== undefined ) {

                line.value = starComment[ 0 ].trim();
                line.comment = starComment[ 1 ].split( '*/' )[ 0 ].trim();
            }
            else {

                line.value = variableSplit[ 1 ].trim();
            }

            infoArray.push( line );
        });

        return infoArray;
    }
};

module.exports = config => {
    return new Parser( config );
};