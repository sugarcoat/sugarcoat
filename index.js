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


    config: require( './notes/parseFiles/input' ),

    
    init: function( options ) {
        
        this.readFile();
        
        this.getFiles(this.configObj);
        
    },
    getFiles: function( data ) {

        var configData = data
            , files;
       
        var glob = require("glob");

        var key = Object.keys( configData );

        for ( var i = 0, l = configData[key].sections.length; i < l; i++ ) {
            var sectObjs = configData[key].sections[i];
            var ObjFiles = sectObjs.files;
            // console.log(sectObjs);

            if ( ObjFiles.indexOf( '*' ) > -1 ) {

                // files = glob.sync( ObjFiles, { nodir: true, matchBase:true } );
                files = glob.sync( ObjFiles );
                configData[key].sections[i].files = files;
                // console.log('I have a star', ObjFiles);
            }
            else {
                // var filesStat = fs.statSync( ObjFiles );
                // var filesTest = filesStat.isFile();
                // if ( filesTest === false ) {
                //     files = glob.sync( ObjFiles+'*', { nodir: true, matchBase:true } );
                //     configData[key].sections[i].files = files;
                // }

                //test if files ends in a slash 
                // console.log('obj', ObjFiles);
                var suffix = '/';
                var suffixLength = suffix.length;
                var filesLength = ObjFiles.length;
                // console.log('obj length', filesLength);
                var slashEnd = ObjFiles.indexOf( suffix, ( filesLength - suffixLength ) );
                // console.log('where the last slash is', slashEnd);
                // console.log( ObjFiles.indexOf( suffix, objFiles.length - suffix.length ) !== -1 );
                if( slashEnd === filesLength - 1) {
                    // console.log('we have and end match!', ObjFiles);
                    files = glob.sync( ObjFiles+'**/*' );
                    configData[key].sections[i].files = files;
                }
                else {
                    files = glob.sync( ObjFiles+'/**/*' );
                    configData[key].sections[i].files = files;
                    // console.log('i do not have an end slash', ObjFiles);
                }
            }
        }

        console.log(configData.patterns.sections);
    },
    readFile: function() {
        //get the data and throw it into a variable that we can use to edit
        this.configObj = configFile;

        // console.log(this.configObj);
        
        // this.parseFiles();
    },
    parseFiles: function() {
        
        var sections = this.config.patterns.sections
            , self = this
            ;
        
        async.each( sections, this.parseFile, function() {
            
            
            self.config.patterns.sections = sections;

            self.renderFiles();
            // console.log( 'DONE!', util.inspect( sections, { depth: 5, colors:true } ));

        });
    },
    parseFile: function( section, callback ) {
        
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
            
            // include original path
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
                        
                        // read file callback
                        return callback( null );
                    });
                },
                function( err ) {
                    
                    // parent callback
                    return callback( null );
                }
            );
        }
    },
    
    renderFiles: function( sections ) {
        
    }
};

module.exports.init();