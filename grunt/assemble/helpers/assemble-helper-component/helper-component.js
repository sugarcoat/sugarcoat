/**
 * Component Helper
 * Copyright (c) 2015 Ryan Fitzer
 * Licensed under the MIT License (MIT).
 */
'use strict';

// Options: https://github.com/67726e/node-ssi
var ssi = require( 'ssi' );

// Options: https://github.com/beautify-web/js-beautify
var beautify = require( 'js-beautify' ).html;

// Export helpers
module.exports.register = function ( Handlebars, options, params ) {

    var grunt = params.grunt;

    /**
     * {{component}}
     *
     * Include HTML content from the specified path.
     * Resolves SSI statements.
     *
     * @param path {String} The path to the component.
     * @param type {String} 'embed' will codefence the markup. Default is 'raw'.
     * @return {String} The contents of the component.
     * @example:
     *   {{component ../path/to/component.html}}
     */
    Handlebars.registerHelper( 'component', function ( path, type ) {

        var content = grunt.file.read( path );
        var parsed = ( new ssi() ).parse( path, content );
        var output = beautify( parsed.contents, {
            indent_size: 2
        });
        var result = {
            raw: output,
            embed: '```html\n' + output + '\n```\n'
        };

        type = type === 'embed' ? type : 'raw';

        return new Handlebars.SafeString( result[ type ] );
    });
};
