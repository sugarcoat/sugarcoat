var fs = require( 'fs' )
    , util = require( 'util' ) 
    , css = require( 'css' )
    , example = require( './notes/example-config')
    , async = require( 'async' )
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
        // console.log( 'before', sections);
        
        async.each( sections, this.parseFile, function() {
            console.log( 'DONE!', util.inspect( sections, { depth:5, colors:true } ));
        });
    },
    parseFile: function( section, callback) {

        // only one file declared
        if ( typeof section.files === 'string' ) {
            
            section.files = [{
                path: section.files
            }];

            return callback( null );
        }
        
        // array of files declared
        var files = section.files;
        section.files = [];
        
        for ( var i = 0; i < files.length; i++ ) {

            var push = {
                path: files[ i ]
            };
            
            section.files.push( push );
        }
        
        return callback( null );
        // console.log(' parse !:', arguments);
    }
};

module.exports.init();