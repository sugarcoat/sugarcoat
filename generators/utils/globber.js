var util = require( 'util' )
    , glob = require( 'glob' )
    , _ = require( 'lodash' )
    , log = require( 'npmlog' )
    ;

function Globber( files ) {

    return this.passFiles( files );
};

Globber.prototype = {
    
    passFiles: function( objFiles ) {

        //array
        if ( util.isArray( objFiles ) ) {

            return this.globArray( objFiles );
            
        }

        //object with an array of files
        else if ( util.isObject( objFiles ) ) {

            var objFilesSrc = objFiles.src
                , objFilesOpts = objFiles.options
                ;

            return this.globArray( objFilesSrc, objFilesOpts );
            
        }

        //not an array
        else {

            var files = glob.sync( objFiles, {} );

            if ( files.length < 1 && files !== 'undefined' ) {

                log.warn( 'Empty glob from file:', objFiles );
            }

            return files;
        }       
    },

    globArray: function( files, options ) {

        var filesArray = []
            , negationsArray = []
            , globbedFiles
            ;

        files.forEach( function( file ) {

            globbedFiles = glob.sync( file, options );
            //change to promise so that we can get an error if the pattern is not proper

            filesArray = filesArray.concat( globbedFiles );


            //get negations files
            if ( file.indexOf( '!' ) > -1 ) {
                
                negationsArray = negationsArray.concat( file );

            }
            
            //error test to make sure we got files back from glob
            if ( filesArray.length < 1 && filesArray !== 'undefined' ) {

                log.warn( 'Empty glob from file:', file );
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