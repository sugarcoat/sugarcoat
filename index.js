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
            console.log( 'DONE!', util.inspect( sections, { depth:5, colors:true } ));
        });
    },
    parseFile: function( section, callback) {
        
        function parseThis( currentFile, data ) {
            var comments = data.split( '/**' );
            
            for ( var i = 1; i < comments.length; i++ ) {
                
                var block = comments[ i ].split(/^\s*\*\//m)
                    , toParse = '/**' + block[ 0 ] + ' */'
                    ;
                
                comments[ i ] = {
                    path: currentFile,
                    data: commentParser( toParse ),                      
                };
                
                comments[ i ].data.code = block[ 1 ];
            }
            
            comments.shift();
            
            var push = {
                path: currentFile,
                data: comments
            };
            
            return push;
        }

        // only one file declared
        if ( typeof section.files === 'string' ) {
            
            var currentFile = section.files;
            
            fs.readFile( currentFile, { encoding: 'UTF8' }, function( err, data ) {
                
                section.files = [];
                section.files.push( parseThis( currentFile, data ));
                
                return callback( null );
            });
        }
        else {
            
            // array of files declared
            var files = section.files;
            section.files = [];
        
            for ( var i = 0; i < files.length; i++ ) {
                
                var currentFile = files[ i ]
                
                fs.readFile( currentFile, { encoding: 'UTF8' }, function( err, data ) {
                    
                    section.files.push( parseThis( currentFile, data ));
                    
                });
            }
            return callback( null );
        }
    }
};

module.exports.init();