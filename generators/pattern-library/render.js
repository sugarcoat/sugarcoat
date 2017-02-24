var fs = require( 'fs' );
var path = require( 'path' );

var mkdirp = require( 'mkdirp' );
var Handlebars = require( 'handlebars' );

var log = require( '../../lib/logger' );

module.exports = function ( config ) {

    return renderLayout( config )
    .catch( function ( err ) {
        return err;
    });
};

/*
    Tasks
*/

function renderLayout( config ) {

    return readFile( config.settings.template.layout )
    .then( function ( data ) {

        return config.settings.template.layout = {
            src: data,
            file: config.settings.template.layout
        };
    })
    .then( function () {

        var hbsCompiled = Handlebars.compile( config.settings.template.layout.src, {
                preventIndent: true
            })
            , file = path.join( config.settings.dest, 'index.html' )
            , html = hbsCompiled( config )
            ;

        return writeFile( file, html )
        .then( function () {

            log.info( 'Render', `layout rendered "${path.relative( config.settings.cwd, file )}"` );

            return html;
        });
    })
    .catch( function ( err ) {
        log.error( 'Render', err );

        return err;
    });
}

/*
    Utilities
*/

function readFile( file ) {

    return new Promise( function ( resolve, reject ) {

        fs.readFile( file, 'utf8', function ( err, data ) {

            if ( err ) return reject( err );

            return resolve( data );
        });
    });
}

function writeFile( file, contents ) {

    return new Promise( function ( resolve, reject ) {

        makeDirs( file )
        .then( function () {

            fs.writeFile( file, contents, function ( err ) {

                if ( err ) return reject( err );

                return resolve( file );
            });
        });
    });
}

function makeDirs( toPath ) {

    return new Promise( function ( resolve, reject ) {

        mkdirp( path.parse( toPath ).dir, function ( err ) {

            if ( err ) return reject( err );

            resolve();
        });
    });
}