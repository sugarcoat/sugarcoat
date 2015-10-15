var configLocation = './notes/example-patterns-config';

var fs = require( 'fs' )
    , util = require( 'util' )
    , configFile = require( configLocation )
    , css = require( 'css' )
    , example = require( './notes/example-config')
    , async = require( 'async' )
    , commentParser = require( 'comment-parser' )
    , Handlebars = require( 'handlebars' )
    ;
// run in the terminal using `node index.js`
module.exports = {

    configObj: {},
    
    template: null,
    
    init: function( options ) {
        
        this.readFile();
        
        // this.setupHandlebars();
    },
    
    readFile: function() {
        //get the data and throw it into a variable that we can use to edit
        this.configObj = configFile;
        
        this.getFiles( this.configObj );
        // console.log(this.configObj);
    },
    
    getFiles: function( data ) {

        var files;
       
        var glob = require("glob");

        var key = Object.keys( data );

        for ( var i = 0, l = data[key].sections.length; i < l; i++ ) {
            var sectObjs = data[key].sections[i];
            var ObjFiles = sectObjs.files;
            // console.log(sectObjs);

            if ( ObjFiles.indexOf( '*' ) > -1 ) {

                // files = glob.sync( ObjFiles, { nodir: true, matchBase:true } );
                files = glob.sync( ObjFiles );
                data[key].sections[i].files = files;
                // console.log('I have a star', ObjFiles);
            }
            else {
                var suffix = '/';
                var suffixLength = suffix.length;
                var filesLength = ObjFiles.length;
                // console.log('obj length', filesLength);
                var slashEnd = ObjFiles.indexOf( suffix, ( filesLength - suffixLength ) );
                if( slashEnd === filesLength - 1) {
                    // console.log('we have and end match!', ObjFiles);
                    files = glob.sync( ObjFiles+'**/*' );
                    data[key].sections[i].files = files;
                }
            }
        }
        
        this.parseFiles();
    },
    
    parseFiles: function() {
        
        var sections = this.configObj.patterns.sections
            , self = this
            ;
        
        async.each( sections, this.parseFile, function() {
            
            self.configObj.patterns.sections = sections;

            self.setupHandlebars();

        });
    },
    parseFile: function( section, callback ) {
        
        var COMMENTSPLIT = /^\s*\*\//m;
        // for html, include trailing comment
        var HTMLCOMMENTSPLIT = /^\s*\*\/\n-->/m;
        
        //internal function that parses using comment-parse on currentFile
        function parseComment( currentFile, data ) {
            
            var isHtmlComponent = false;
            
            // grab each comment block
            var comments = data.split( '/**' );
            
            // the first array item is empty if not an html component
            if ( comments[ 0 ].length !== 0 ) {
                
                isHtmlComponent = true;
            }
            
            comments.shift();
            
            for ( var i = 0; i < comments.length; i++ ) {
                
                // split blocks into comment and code content
                var block = isHtmlComponent 
                    ? comments[ i ].split( HTMLCOMMENTSPLIT )
                    : comments[ i ].split( COMMENTSPLIT ) 
                    , toParse = '/**' + block[ 0 ] + ' */'
                    ;
                
                // add comment section to array
                comments[ i ] = commentParser( toParse )[ 0 ];
                
                if ( isHtmlComponent ) {
                    
                    // if there's a following comment block, remove the starting html comment
                    var lastCommentBlock = block[ 1 ].lastIndexOf( '<!--' )
                        , isLastComment = block[ 1 ].length - lastCommentBlock === 5
                        ;
                    
                    if ( isLastComment ) {
                        block[ 1 ] = block[ 1 ].slice(0, lastCommentBlock );
                    }
                }
                // add code to data obj
                comments[ i ].code = block[ 1 ];
            }

            return {
                path: currentFile,
                data: comments
            };
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
    
    renderFiles: function() {
        
        var config = this.configObj.patterns
            , sections = config.sections
            ;
        
        //Check what type a section is, then route them accordingly
        for ( var i = 0; i < sections.length; i++ ) {
            
            // special type variables needs to read in sass or less file, then spit out layout
            if ( sections[ i ].type === 'variables' ) {
                
                this.renderVariablesTemplate(sections[ i ]);
                
            }
            else if ( !sections[ i ].type ) {
                
                //do normal rendering on array of files
                this.renderTemplate();
            }
            else {
                
                console.log( 'Invalid Type declared for section: ', sections[ i ].title );
            }
        }
        
    },
    
    setupHandlebars: function() {
        
        // TODO: make this default or based on options obj
        var partialsDir = 'demo/documentation/templates/partials'
            , templateSrc = this.configObj.patterns.settings.template
            , self = this
            ;
       
        fs.readdir( partialsDir, function( err, files ) {
            
            // register all partials
            async.each( files, function( filename, callback ) {
                
                var matches = /^([^.]+).hbs$/.exec( filename );
                if ( !matches ) {
                    return;
                }
                var name = matches[ 1 ];
                
                // read file async and add to handlebars
                fs.readFile( partialsDir + '/' + filename, 'utf8', function( err, partial ) {
                    
                    Handlebars.registerPartial( name, partial );
                    return callback( null );
                });
                
            }, function() {
                
                // read template file
                fs.readFile( templateSrc, { encoding: 'utf-8'}, function( err, data ) {
            
                    self.template = Handlebars.compile( data );
                    self.renderFiles();
                });
            });            
        });
        
        
    },
    
    renderVariablesTemplate: function( section ) {
        // look up which template type (color or typography)
        // get info about each 
        var templateType = section.template
            ;

        if ( templateType === 'color' ) {
            //get each color name, that variable, and if they have a usage
            
            var colorsInfo = [];
            
            //get the info needed for template
            //take the code and create an obj with it's info 
            for ( var i = 0; i < section.files.length; i++ ) {

                for ( var j = 0; j < section.files[i].data.length; j++ ){

                    var code = section.files[i].data[j].code;
                    // console.log(code);
                    var colorStrings = code.split( '\n' );
                    // console.log(colorStrings);
                    colorStrings = colorStrings.filter(Boolean);
                    // console.log(colorStrings);
                    
                    for ( var k = 0; k < colorStrings.length; k++ ) {

                        // console.log(colors[k]);

                        var usageSplit = colorStrings[k].split('//');
                        var statmentSplit = usageSplit[0].split(':');

                        colorsInfo.push({
                            'variable': statmentSplit[0],
                            'color': statmentSplit[1],
                            'usage': usageSplit[1]
                        });
                    }
                }   
            }

            // console.log(colorsInfo); 

            //take info and create a template for it
            //  --------
            // | #hex   |
            // |        |
            //  --------
            // $variable name
            // uses: ...
            
            var html = '';
            var container = '<div class="color-swatches">';
            var closingDiv = '</div>';

            html += container;
            
            //put it into a template
            for ( var i = 0; i < colorsInfo.length; i++ ) {

                var colorVar = colorsInfo[i].variable;
                var colorHex = colorsInfo[i].color;
                var colorUsage = colorsInfo[i].usage;
                
                var indivSwatch = '<div class="color-swatch">';
                var colorSwatch = '<div class="swatch" style="background-color:' + colorHex + '"><span>' + colorHex + '</span></div>';
                var swatchVar = '<h1>' + colorVar + '</h1>';
                var swatchUses = '<p>' + colorUsage + '</p>';

                html += indivSwatch;
                html += colorSwatch;
                html += swatchVar;
                if ( colorUsage ) { html += swatchUses; }
                html += closingDiv;

                // var indivSwatch = document.createElement( 'div' );
                // indivSwatch.className( 'color-swatch' );

                // var colorSwatch = document.createElement( 'div' );
                // colorSwatch.className( 'swatch' );
                // colorSwatch.setAttribute( 'style', 'background-color:'+colorHex );

                // var colorSwatchSpan = createElement( 'span' );
                // colorSwatchSpan.createTextNode( colorHex );

                // var swatchVar = document.createElement( 'h1' );
                // swatchVar.createTextNode( colorVar );

                // var swatchUses = document.createElement( 'p' );
                // swatchUses.createTextNode( colorUsage );

                // colorSwatch.appendChild(colorSwatchSpan);
                // indivSwatch.appendChild(colorSwatch);
                // indivSwatch.appendChild(swatchVar);
                // indivSwatch.appendChild(swatchUses);

                // var swatchModule = indivSwatch.appendChild(indivSwatch);

                // container.appendChild(swatchModule);
            }

            html += closingDiv;
            //console.log(html);
        }
        if ( templateType === 'typography' ) {
            //get info needed
            for ( var i = 0; i < section.files.length; i++ ) {

                for ( var j = 0; j < section.files[i].data.length; j++ ){

                    var code = section.files[i].data[j].code;
                    // console.log(code);
                    // console.log('---');
                    // var typeStrings = code.split( '\n' );
                    // typeStrings = typeStrings.filter(Boolean);
                    // console.log(typeStrings);
                }
            }

            //font family: Arial
            //variable: $Arial
            //The quick brown fox jumps over the lazy dog. (reg)

            // var html = '';
            // var container = '<div class="container">';

            // html += container;

            // for ( var k = 0; k < something.length; k++ ) {

            //     var fontFamily;
            //     var fontVar;

            //     var ffBlock = '<div class="font-block">';
            //     var ffName = '<p class="font-name">Font Family: ' + fontFamily + '</p>';
            //     var ffVar = '<p class="font-variable">Variable: ' + fontVar + '</p>';
            //     var ffExample = '<p>The quick brown fox jumps over the lazy dog.</p>'
            //     var closingDiv = '</div>';

            //     html += ffBlock;
            //     html += ffName;
            //     html += ffVar;
            //     html += ffExample;
            //     html += closingDiv;
            // }
            
            // html += closingDiv;
        }
        

    },
    
    renderTemplate: function() {
        console.log( 'renderTemplate' );
        // var templateSrc = this.configObj.patterns.settings.template;
        var sections = this.configObj.patterns;
        
        console.log( this.template( sections ));
       
        // fs.readFile( templateSrc, { encoding: 'utf-8'}, function( err, data ) {
        //
        //     var template = Handlebars.compile( data );
        //     var page = template( sections );
        //
        //     // console.log( page );
        // });
    }
};

module.exports.init();