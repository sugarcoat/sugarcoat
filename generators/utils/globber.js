var util = require( 'util' )
    , glob = require( 'glob' )
    , _ = require( 'lodash' )
    ;

function Globber( files ) {

    return this.passFiles( files );
};

Globber.prototype = {
    
    passFiles: function( objFiles ) {

        if ( util.isArray( objFiles ) ) {

            return this.globArray( objFiles );
            
        }

        else if ( util.isObject( objFiles ) ) {

            var objFilesSrc = objFiles.src
                , objFilesOpts = objFiles.options
                ;

            return this.globArray( objFilesSrc );
            
        }

        else {

            files = glob.sync( objFiles, {} );

            return files;
        }        
    },

    globArray: function( files ) {

        var filesArray = []
            , negationsArray = []
            , globbedFiles
            ;

        files.forEach( function( file ) {

            globbedFiles = glob.sync( file, {} );
            // glob( file, {}, function( error ) {
            //     console.log('err', error);
            //     console.log('file', file);
            //     // console.log('array of file names', globbedFiles);
            // });

            filesArray = filesArray.concat( globbedFiles );


            if ( file.indexOf( '!' ) > -1 ) {
                
                negationsArray = negationsArray.concat( file );
            }
        });

        filesArray = this.negateFiles( filesArray, negationsArray );

        return filesArray;
    },

    negateFiles: function( filesArray, negationsArray ) {

        negationsArray.forEach( function( negation, index, array ) {

            array[index] = negation.replace( '!','' );
        });

        filesArray = _.difference( filesArray, negationsArray );

        return filesArray;
    }
};

module.exports = function( options ) {
    return new Globber( options );
};