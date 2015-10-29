var util = require( 'util' )
    , fs = require( 'fs' )
    // , winston = require( 'winston' )
    , log = require( 'npmlog' )
    , render = require( './lib/render' )
    , parser = require( './lib/parser' )
    , globber = require( '../utils/globber' )
    ;

/**
 *
 */
function Generate( options ) {

    var self = this;

    this.parser = parser();

    // Glob files arrays
    
    // console.log(  );
    Promise.all( getFiles( options.sections ) )
        .then( function( values ) {
        
            values.forEach( function( value, index ) {
                
                options.sections[ index ].files = value;
            });
        })
        .then( this.promiseFiles.bind( this, options.sections ))
        .then( function ( values ) {

            options.sections = values;

            return options;
        })
        .then( render );
}

/**
 *
 */
function getFiles( sections ) {

    return sections.map( function( section ) {

        return globber( section.files );
    });
}


// run in the terminal using `node index.js`
Generate.prototype = {

    promiseFiles: function( sections ) {

        var self = this;

        return Promise.all( sections.map( function( section ) {

            return self.readSection( section );
        }));
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
    }
};

// new Generate();

module.exports = function( options ) {

    return new Generate( options );
};