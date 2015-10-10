var fs = require( 'fs' )
    , util = require( 'util' ) 
    , css = require( 'css' )
    , example = require( './notes/example-config')
    , async = require( 'async' )
    , commentParser = require( 'comment-parser' )
    ;
// run in the terminal using `node index.js`
module.exports = {
    config: require( './notes/parseFiles/input' ).patterns.sections,
    
    init: function( options ) {
        
        // TODO: where should our test options really live? How are they consumed outside of this file when implemented as a node module? Need to research 
        
        // TODO: read in all source files, not just srcCSS. we should be able to give a function the source given by the options object, and output an array of file names.
        var files;
        
        // TODO: need to create recursive function to get all internal folders
        // can probably use Glob <https://www.npmjs.com/package/glob>
        var glob = require("glob");


        files = glob.sync( example.patterns.sections[1].files, { nodir: true } );
        // console.log(util.inspect(files, { depth:5, colors: true }));
        
        this.parseFiles();
    },
    parseFiles: function() {
        
        var sections = this.config;
        
        async.each( sections, this.parseFile, function() {
            // console.log( 'DONE!', util.inspect( sections, { depth:5, colors:true } ));
        });
    },
    parseFile: function( section, callback) {

        // only one file declared
        if ( typeof section.files === 'string' ) {
            
            fs.readFile( section.files, { encoding: 'UTF8' }, function( err, data ) {
                
                section.files = [
                    {
                        path: section.files,
                        data: data
                    }
                ];
                
                return callback( null );
            });
            //
            // section.files = [{
            //     path: section.files
            // }];

            // fs.readFile( section.files[ 0 ].path )
        }
        else {
            
            // array of files declared
            var files = section.files;
            section.files = [];
        
            for ( var i = 0; i < files.length; i++ ) {
                
                var currentFile = files[ i ]
                
                fs.readFile( currentFile, { encoding: 'UTF8' }, function( err, data ) {
                    
                    var push = {
                        path: currentFile,
                        data: data
                    };
                    
                    section.files.push( push );
                    
                });
            }
            return callback( null );
        }
    }
};

module.exports.init();