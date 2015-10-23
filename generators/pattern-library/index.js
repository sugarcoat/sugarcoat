var util = require( 'util' )
    , async = require( 'async' )
    , render = require( './lib/render' )
    , parser = require( './lib/parser' )
    , globber = require( '../utils/globber' )
    , config = require( './example/config.js' )
    ;

function Generate( options ) {
    
    this.configObj = options || config
    this.parser = parser();
    
    this.getFiles();
};
// run in the terminal using `node index.js`
Generate.prototype = {

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
        async.each( sections, this.parser.parseSection.bind( this.parser ), function() {
            
            // set config obj to new state with added data
            self.configObj.sections = sections;
            
            render( self.configObj );
            
        });
    }
};

// new Generate();

module.exports = function( options ) {

    return new Generate( options );
};