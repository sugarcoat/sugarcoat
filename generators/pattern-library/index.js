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
    options.sections = getFiles( options.sections );

    Promise.all( this.promiseFiles.call( this, options.sections ) )
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

        section.files = globber( section.files );

        return section;
    });
}


// run in the terminal using `node index.js`
Generate.prototype = {

    promiseFiles: function( sections ) {

        var self = this;

        return sections.map( function( section ) {

            return self.readSection( section );
        });
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