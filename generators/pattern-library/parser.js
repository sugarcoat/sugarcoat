/**
 * Takes a section object with title key and files string or array and returns the parsed comments
 */
/*
    TODO Can this be refactored to not require a Constructor?
*/
var log = require( '../../lib/logger' );
var serializer = require( 'comment-serializer' );
var mySerializer = serializer({ 
    parsers: serializer.parsers()
});

function Parser( config ) {

    log.config( config.settings.log );
}

Parser.prototype = {

    parseComment: function( currentFile, data, type, templateType ) {
        
        log.info( 'Parse', currentFile );
                
        var serialized = mySerializer( data );
        
        // serializer error handling
        var hasErrors = serialized.some( function( comment ) {
            
            return comment.tags.some( function ( tag ) {
                
                return tag.error;
            });
        });
        
        if ( hasErrors ) {
            
            console.log( 'Errors' );
        }
                
        for ( var i = 0; i < serialized.length; i++ ) {
            
            if ( type === 'variable' ) {
                
                serialized[ i ].serializedCode = this.parseVarCode( serialized[ i ].context, currentFile );
            }
            
            var context = serialized[ i ].context;
            
            // check if context is html. it will have an ending comment block in it
            var match = /-->\n*/.exec( context );
            
            if ( match ) {
                
                var html = context.substring( 4 );

                serialized[ i ].context = html ;
            }
        }        

        return serialized;
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
                
                // check to see if comment has a leading space
                var result = /\s(.*)/.exec( usageSplit[ 1 ]);
                
                if ( result && result.index === 0 ) {
                    
                    // remove leading space
                    usageSplit[ 1 ] = usageSplit[ 1 ].substring( 1, usageSplit[ 1 ].length );
                }

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