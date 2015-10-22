var util = require( 'util' )
    , fs = require( 'fs' )
    , async = require( 'async' )
    , render = require( './generators/pattern-library/lib/render' )
    , parser = require( './generators/pattern-library/lib/parser' )
    , globber = require( './generators/pattern-library/lib/globber' )
    ;

function Generate( options ) {
    
    this.configObj = options || require( './generators/pattern-library/example/config.js' );
    
    this.init();
};
// run in the terminal using `node index.js`
Generate.prototype = {
        
    init: function( options ) {
        
        this.getFiles();
    },

    getFiles: function() {

        var sections = this.configObj.sections;

        sections.forEach( function( section ){

            var newFiles = globber( section.files );

            section.files = newFiles;
        });
        
        this.parseFiles();
    },
    
    parseFiles: function() {
        
        var sections = this.configObj.sections
            , self = this
            ;
        
        // must bind to parser to retain scope
        async.each( sections, parser.parseSection.bind( parser ), function() {
            
            // set config obj to new state with added data
            self.configObj.sections = sections;
            
            render( self.configObj );

        });
    }
};

module.exports = new Generate();