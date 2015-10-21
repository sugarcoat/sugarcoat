var util = require( 'util' )
    , glob = require( 'glob' )
    , async = require( 'async' )
    , render = require( './generators/pattern-library/lib/render' )
    , parser = require( './generators/pattern-library/lib/parser' )
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

        var files;

        var key = Object.keys( data );

        for ( var i = 0; i < key.length; i++ ){

            for ( var j = 0; j < data[key[i]].sections.length; j++ ) {
                
                var sectObjs = data[key[i]].sections[j];
                var objFiles = sectObjs.files;
                
                data[key[i]].sections[j].files = this.getGlob( objFiles );
            }
        }
        
        this.parseFiles();
    },
    
    getGlob: function( objFiles ) {
        
        if( objFiles instanceof Array ) {

            var tempFiles = [];

            for ( var k = 0; k < objFiles.length; k++ ) {
                
                if ( objFiles[k].indexOf( '*' ) > -1 ) {

                    files = glob.sync( objFiles[k] );
                    // data[key[i]].sections[j].files[k] = files;
                   for ( l = 0; l < files.length; l++ ) {

                        tempFiles.push(files[l]);
                        // console.log('file', files[l]);
                    }
                }

                else {
                    var suffix = '/';
                    var suffixLength = suffix.length;
                    var filesLength = objFiles[k].length;
                    var slashEnd = objFiles[k].indexOf( suffix, ( filesLength - suffixLength ) );
                    
                    if( slashEnd === filesLength - 1) {
                        // console.log('we have and end match!', objFiles[k]);
                        files = glob.sync( objFiles[k]+'**/*', { nodir: true, matchBase:true } );
                        
                        for ( m = 0; m < files.length; m++ ) {
                            
                            tempFiles.push(files[m]);
                        }
                    }
                    else {
                        tempFiles.push(objFiles[k]);
                    }
                }
            } 
            return tempFiles;
            // console.log(tempFiles);
            // data[key[i]].sections[j].files = tempFiles;      
        }

        if ( objFiles.indexOf( '*' ) > -1 ) {

            // files = glob.sync( objFiles, { nodir: true, matchBase:true } );
            files = glob.sync( objFiles );
            return files;
            // console.log('I have a star', objFiles);
        }

        else {
            var suffix = '/';
            var suffixLength = suffix.length;
            var filesLength = objFiles.length;
            var slashEnd = objFiles.indexOf( suffix, ( filesLength - suffixLength ) );
            
            if( slashEnd === filesLength - 1) {
                // console.log('we have and end match!', objFiles);
                files = glob.sync( objFiles+'**/*' );
                
                return files;
            }
            else {
                return objFiles;
            }
            
        }
    },
    
    parseFiles: function() {
        
        var sections = this.configObj.patterns.sections
            , self = this
            ;
        
        // must bind to parser to retain scope
        async.each( sections, parser.parseSection.bind( parser ), function() {
            
            // set config obj to new state with added data
            self.configObj.patterns.sections = sections;
            
            render( self.configObj.patterns );

        });
    }
};

module.exports = new Generate();