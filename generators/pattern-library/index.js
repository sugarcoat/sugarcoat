var util = require( 'util' )
    // , async = require( 'async' )
    , fs = require( 'fs' )
    , render = require( './lib/render' )
    , parser = require( './lib/parser' )
    , globber = require( '../utils/globber' )
    ;

function Generate( options ) {
        
    this.configObj = options;
    this.parser = parser();
    
    this.getFiles();
}
// run in the terminal using `node index.js`
Generate.prototype = {

    getFiles: function() {

        var sections = this.configObj.sections
            , self = this
            ;

        sections.forEach( function( section ){

            var newFiles = globber( section.files );

            section.files = newFiles;
        });
        
        // this.readFiles();
        Promise.all([
            this.readFiles()
        ])
        // .then( this.parseFiles.bind( this ) )
        .then( this.renderFiles.bind( this ));
        
        // this.parseFiles();
    },
    
    readFiles: function() {
        
        function maxCount () {
            
            var count = 0;
            
            sections.forEach( function( section ) {
                count += section.files.length;
            });
            
            return count;
        }
        
        var sections = this.configObj.sections;
        var max = maxCount();
        var current = 0;
        var self = this;
        
        return new Promise( function( resolve, reject ) {
            
            sections.forEach( function( currentSection, i ) {
                
                var currentFiles = currentSection.files;
            
                currentFiles.forEach( function( currentFile, j ) {
                    
                    fs.readFile( currentFile, { encoding: 'UTF8'}, function( err, data ) {
                        
                        current++;
                        
                        sections[ i ].files[ j ] = {
                            currentFile: currentFile,
                            data: self.parser.parseComment( currentFile, data, currentSection.template )
                        };
                        
                        if ( current === max ) resolve( sections );
                        
                    });
                });
            });
        });
    },
    
    parseFiles: function( sections ) {
        
        // return this.parser.parseSections( sections[ 0 ] );
    },
    
    renderFiles: function() {

        render( this.configObj );
    }
};

// new Generate();

module.exports = function( options ) {

    return new Generate( options );
};