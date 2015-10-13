var configLocation = './notes/example-patterns-config';

var fs = require( 'fs' )
    , util = require( 'util' )
    , configFile = require( configLocation )
    , css = require( 'css' )
    , example = require( './notes/example-config')
    , async = require( 'async' )
    , commentParser = require( 'comment-parser' )
    ;
// run in the terminal using `node index.js`
module.exports = {

    configObj: {},

    config: require( './notes/parseFiles/input' ).patterns.sections,
    
    init: function( options ) {

        // var configData = this.configObj;
        
        this.readFile();
        console.log(this.configObj);
        this.getFiles(this.configObj);
        //this.writeFile();
    },
    getFiles: function( data ) {

        var configData = data
            , files;
       
        var glob = require("glob");

        console.log(configData.config);
        // var key = Object.keys( configData );
        // // console.log(configFile[key].sections.length);

        // for ( var i = 0, l = data[key].sections.length; i < l; i++ ) {
        //     var sectObjs = data[key].sections[i];
        //     var ObjFiles = sectObjs.files;
        //     console.log('file name ', ObjFiles);

        //     if ( ObjFiles.indexOf( '*' ) > -1 ) {

        //         files = glob.sync( ObjFiles, { nodir: true, matchBase:true } );
        //         console.log(util.inspect(files, { depth:5, colors: true }));
        //     }
        //     else {
        //         var filesStat = fs.statSync( ObjFiles );
        //         var filesTest = filesStat.isFile();
        //         // console.log(filesTest);
        //         if ( filesTest === false ) {
        //             files = glob.sync( ObjFiles+'*', { nodir: true, matchBase:true } );
        //             console.log(util.inspect(files, { depth:5, colors: true }));
        //         }
        //     }
        // }
    },
    readFile: function() {
        //get the data and throw it into a variable that we can use to edit
        this.configObj = fs.readFileSync('./notes/example-patterns-config.js', 'utf-8');
        // console.log(this.configObj);
        
        // this.parseFiles();
    },
    parseFiles: function() {
        
        var sections = this.config;
        
        async.each( sections, this.parseFile, function() {
            
            console.log( 'DONE!', util.inspect( sections, { depth: 5, colors:true } ));

        });
    },
    parseFile: function( section, callback) {
        
        //internal function that parses using comment-parse on currentFile
        function parseComment( currentFile, data ) {
            
            // grab each comment block
            var comments = data.split( '/**' );
            
            // the first array item is always an empty string, so we shift
            comments.shift();
            
            
            for ( var i = 0; i < comments.length; i++ ) {
                
                // split blocks into comment and code content
                var block = comments[ i ].split(/^\s*\*\//m)
                    , toParse = '/**' + block[ 0 ] + ' */'
                    ;
                
                // add comment section to array
                comments[ i ] = commentParser( toParse )[ 0 ];
                
                // add code to data obj
                comments[ i ].code = block[ 1 ];
            }
            
            // now include path
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
                section.files.push( parseComment( currentFile, data ));
                
                return callback( null );
            });
        }
        else {
            
            // array of files declared
            var files = section.files;
            section.files = [];
            
            async.each( files,
                function( item, callback ) {
                    
                    var currentFile = item;
                    
                    // read all files
                    fs.readFile( currentFile, { encoding: 'UTF8'}, function( err, data ) {
                        
                        section.files.push( parseComment( currentFile, data ));
                        
                        return callback( null );
                    });
                },
                function( err ) {

                    return callback( null );
                }
            );
        }
    }
};

module.exports.init();