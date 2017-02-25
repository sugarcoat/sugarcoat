var path = require( 'path' );

// var _ = require( 'lodash' );
// var postcss = require( 'postcss' );
// var prefixer = require( 'postcss-prefix-selector' );
var Handlebars = require( 'handlebars' );

var log = require( '../../lib/logger' );

// var globber = require( '../../lib/globber' );
var fsp = require( '../../lib/fs-promiser' );

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

    return fsp.readFile( config.settings.template.layout )
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

        return fsp.writeFile( file, html )
        .then( () => {

            log.info( 'Render', `layout rendered "${path.relative( config.settings.cwd, file )}"` );

            return html;
        });
    })
    .catch( function ( err ) {
        log.error( 'Render', err );

        return err;
    });
}
