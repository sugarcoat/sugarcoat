var util = require( 'util' )
    // , glob = require( 'glob' )
    , async = require( 'async' )
    , render = require( './generators/pattern-library/lib/render' )
    , parser = require( './generators/pattern-library/lib/parser' )
    , globber = require( './generators/pattern-library/lib/globber' )
    // , _ = require( 'lodash' )
    ;

global.__base = __dirname + '/';

function Generate( options ) {
    
    this.configObj = options || require( './generators/pattern-library/example/config.js' );
    
    this.init();
};
// run in the terminal using `node index.js`
Generate.prototype = {
    
    template: null,
    
    init: function( options ) {
        
        this.readFile();
    },
    
    readFile: function() {
        
        this.getFiles( this.configObj );
    },

    getFiles: function( data ) {

        var sections = data.sections
            , self = this;

        sections.forEach( function( section, index ){

            var newFiles = globber( section.files );

            section.files = newFiles;
        });

        // console.log(data.sections);
        
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