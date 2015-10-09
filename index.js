var fs = require( 'fs' )
    , util = require( 'util' ) 
    , css = require( 'css' )
    , example = require( './notes/example-config')
    ;
// run in the terminal using `node index.js`
module.exports = {
    
    init: function( options ) {
        
        // TODO: where should our test options really live? How are they consumed outside of this file when implemented as a node module? Need to research 
        
        // TODO: read in all source files, not just srcCSS. we should be able to give a function the source given by the options object, and output an array of file names.
        var files;
        
            // TODO: need to create recursive function to get all internal folders
            // can probably use Glob <https://www.npmjs.com/package/glob>
            var glob = require("glob");


            files = glob.sync( example.patterns.sections[1].files, { nodir: true } );
            console.log(util.inspect(files, { depth:5, colors: true }));
    }
};

module.exports.init();