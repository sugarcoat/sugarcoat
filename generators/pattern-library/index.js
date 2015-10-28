var util = require( 'util' )
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
        
        sections.forEach( function( section ) {
            
            section.files = globber( section.files );
        });
        
        this.promiseFiles();
    },
    
    promiseFiles: function() {
        
        var self = this;
        
        this.configObj.sections = this.configObj.sections.map( function( section ) {
            
            return self.readSection( section );
        });
        
        Promise.all(
            this.configObj.sections
        )
        .then( this.composeData.bind( this ))
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
    
    composeData: function( values ) {
        
        this.configObj.sections = values;
    },

    renderFiles: function() {

        render( this.configObj );
    }
};

// new Generate();

module.exports = function( options ) {

    return new Generate( options );
};