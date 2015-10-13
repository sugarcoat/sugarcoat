var config = './notes/example-patterns-config';

var fs = require( 'fs' )
    , util = require( 'util' )
    , configFile = require( config)
    ;
// run in the terminal using `node index.js`
module.exports = {

    configObj: {},
    init: function( options ) {
        var configData;
        
        this.readFile();
        // console.log(configData);
        // this.getFiles();
        //this.writeFile();
    },
    getFiles: function() {
        var files;
       
        var glob = require("glob");

        var key = Object.keys(configFile);
        // console.log(configFile[key].sections.length);

        for ( var i = 0, l = configFile[key].sections.length; i < l; i++ ) {
            var sectObjs = configFile[key].sections[i];
            var ObjFiles = sectObjs.files;
            // console.log('file name ', ObjFiles);

            if ( ObjFiles.indexOf( '*' ) > -1 ) {

                files = glob.sync( ObjFiles, { nodir: true, matchBase:true } );
                console.log(util.inspect(files, { depth:5, colors: true }));
            }
            else {
                var filesStat = fs.statSync( ObjFiles );
                var filesTest = filesStat.isFile();
                // console.log(filesTest);

                if ( filesTest === false ) {
                    files = glob.sync( ObjFiles+'*', { nodir: true, matchBase:true } );
                    console.log(util.inspect(files, { depth:5, colors: true }));
                }
            }
        }
    },
    readFile: function() {
        //get the data and throw it into a variable that we can use to edit
        this.configObj = fs.readFileSync('./notes/example-patterns-config.js', 'utf-8');
        console.log(this.configObj);
    }
};

module.exports.init();