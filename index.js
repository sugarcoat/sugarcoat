var util = require( 'util' )
    , glob = require( 'glob' )
    , async = require( 'async' )
    , render = require( './generators/pattern-library/lib/render' )
    , parser = require( './generators/pattern-library/lib/parser' )
    , _ = require( './node_modules/grunt/node_modules/lodash/lodash' )
    ;

global.__base = __dirname + '/';

function Generate( options ) {
    
    this.configObj = options || require( './generators/pattern-library/example/config.js' );
    
    this.init();
};
// run in the terminal using `node index.js`
Generate.prototype = {
    
    template: null,
    
    init: function( options ) {
        
        this.readFile();
    },
    
    readFile: function() {
        
        // TODO: need to execute get files on the parameter only, not through the whole obj
        this.getFiles( this.configObj );
        
    },
    
    getFiles: function( data ) {

        var sections = data.sections
            , self = this;

        sections.forEach( function( section, index ){

            var newFiles = self.globFiles( section.files );

            section.files = newFiles;
        });

        // console.log(data.sections);
        
        this.parseFiles();
    },
    
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
    },

    parseFiles: function() {
        
        var sections = this.configObj.sections
            , self = this
            ;
        
        // must bind to parser to retain scope
        async.each( sections, parser.parseSection.bind( parser ), function() {
            
            // set config obj to new state with added data
            self.configObj.sections = sections;
            
            render( self.configObj );

        });
    }
};

module.exports = new Generate();