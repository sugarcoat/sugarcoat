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
        
        var sectionPromises = sections.map( function( section ) {
            
            section.files = globber( section.files );
            
            return self.readSection( section );
        });
        
        Promise.all([
            sectionPromises
        ])
        .then( this.renderFiles.bind( this ));
    },
    
    readSection: function( section ) {

        var files = section.files;
        var current = 0;
        var self = this;
        
        return new Promise( function( resolve, reject ) {
            
            files.forEach( function( currentFile, index ) {
                
                fs.readFile( currentFile, { encoding: 'UTF8'}, function( err, data ) {
                    
                    current++;
                    
                    section.files[ index ] = {
                        currentFile: currentFile,
                        data: self.parser.parseComment( currentFile, data, section.template )
                    };
                    
                    if ( current === files.length ) resolve( section );
                    
                });
            });
        });
    },

    renderFiles: function() {

        render( this.configObj );
    }
};

// new Generate();

module.exports = function( options ) {

    return new Generate( options );
};