/**
 *
 *
 *
 *
 */

var util = require( 'util' )
var fs = require( 'fs' );
var log = require( 'npmlog' );
var render = require( './library/js/render' );
var parser = require( './library/js/parser' );
var globber = require( '../utils/globber' )git;

function Generate( options ) {

    this.parser = parser();

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

                    if ( err ) {

                        log.error( err );
                    }

                    current++;

                    section.files[ index ] = {
                        currentFile: currentFile,
                        data: self.parser.parseComment( currentFile, data, section.type, section.template )
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