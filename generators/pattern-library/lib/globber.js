var util = require( 'util' )
    , glob = require( 'glob' )
    , _ = require( 'lodash' )
    ;

function Globber( files ) {

    var globbedFiles = this.globFiles( files );

    return globbedFiles;
};

Globber.prototype = {
    
    globFiles: function( objFiles ) {

        var filesArray = []
            , negationsArray = []
            , files
            , self = this
            ;

        if ( util.isArray( objFiles ) ){

            objFiles.forEach(function( file ){

                files = glob.sync( file, {} );

                filesArray = filesArray.concat(files);

                if( file.indexOf('!') > -1 ){
                    negationsArray = negationsArray.concat(file);
                }
            });

            filesArray = self.negateFiles( filesArray, negationsArray );

            return filesArray;
        }

        else if( util.isObject( objFiles ) ){

            var objFilesSrc = objFiles.src,
                objFilesOpts = objFiles.options;

            objFilesSrc.forEach( function( file ){

                files = glob.sync( file, {} );

                filesArray = filesArray.concat(files);

                if( file.indexOf('!') > -1 ){
                    negationsArray = negationsArray.concat(file);
                }
            });

            filesArray = self.negateFiles( filesArray, negationsArray );

            return filesArray;
        }

        else {

            files = glob.sync( objFiles, {} );

            return files;
        }        
    },

    negateFiles: function( filesArray, negationsArray ) {

        negationsArray.forEach(function( negation, index, array ){

            array[index] = negation.replace( '!','' );
        });

        filesArray = _.difference( filesArray, negationsArray );

        return filesArray;
    }
};

module.exports = function( options ) {
    return new Globber( options );
}