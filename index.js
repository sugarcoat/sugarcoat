var fs = require( 'fs' )
    , css = require( 'css' )
    , testOptions = {
        srcCSS: 'demo/library/styles',
        srcJS: 'demo/library/js/modules'
    };

// run in the terminal using `node index.js`
module.exports = {
    
    init: function( options ) {
        
        // TODO: where should our test options really live? How are they consumed outside of this file when implemented as a node module? Need to research 
        options = options || testOptions;
        
        // TODO: read in all source files, not just srcCSS. we should be able to give a function the source given by the options object, and output an array of file names.
        var srcCSS = options.srcCSS
            , sourceStats = fs.statSync( srcCSS ) // gets stats objects that tells us the file type
            , sourceType = sourceStats.isFile() ? 'file' : 'directory'
            , files
            ;
        
        if ( sourceType === 'file' ) {
            
            files = fs.readFileSync( srcCSS, { encoding: 'utf-8' });
        }
        else {
            
            // TODO: need to create recursive function to get all internal folders
            // can probably use Glob <https://www.npmjs.com/package/glob>
            files = fs.readdirSync( srcCSS );
        }
        
        console.log( files );
    }
};

module.exports.init();