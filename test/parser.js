'use strict';

var assert = require( 'chai' ).assert;
var fs = require( 'fs-extra' );

var parser = require( '../lib/parser' );
var sugarcoat = require( '../lib/index' );

suite( 'Parser: parseComment', function () {

    test( 'HTML comments are consumed and context applied is accurate', function () {

        fs.readFile( './test/sugarcoat', 'utf8', ( error, fileData ) => {

            if ( error ) {
                console.log( 'we good', error);
            }
            else {
                console.log('ruh roh');
            }
        });
        // var configParseHTMLComment = {
        //     dest: './test/sugarcoat',
        //     display: {
        //         title: 'Pattern Library'
        //     },
        //     sections: [
        //         {
        //             title: 'HTML File',
        //             files: './test/assert/parseComment.html'
        //         }
        //     ]
        // };
        // var parse = parser( configParseHTMLComment );

        // var path = configParseHTMLComment.sections[ 0 ].files;

        // var testPromise = new Promise( ( resolve, reject ) => {

        //     fs.readFile( path, 'utf-8', ( err, data ) => {
        //         if ( err ) return false;
        //         var value = parse.parseComment( path, data, configParseHTMLComment.sections[ 0 ].mode, configParseHTMLComment.sections[ 0 ].template );

        //         return resolve( value );
        //     });
        // });

        // return testPromise.then( result => {
        //     assert.equal( result[ 0 ].context, '<p class="component">\n\tI\'m a component\n\t<!-- an inline comment -->\n</p>', 'following html comment block ignored from context');
        // });
    });

    // test( 'Sugarcoat returned an error from Comment Serializer when there was an issue parsing comments.', done => {

    //     fs.readFile( './test/sugarcoat/index.html', 'utf8', ( error, fileData ) => {

    //         if ( error ) {
    //             console.log( 'we good');
    //         }
    //         else {
    //             console.log('ruh roh');
    //         }
    //     });
    //     var configParserError = {
    //         dest: './test/sugarcoat',
    //         display: {
    //             title: 'Pattern Library'
    //         },
    //         sections: [
    //             {
    //                 title: 'CSS File',
    //                 files: './test/assert/parseComment.css'
    //             }
    //         ]
    //     };

    //     sugarcoat( configParserError )
    //     .then( data => {

    //         assert.instanceOf( data, Error, 'Sugarcoat should return an error and reject the promise.' );
    //         done();

    //     }, data => {

    //         assert.instanceOf( data, Error, 'The object returned was an Error object.');
    //         done();
    //     });
    // });

    teardown( done => {

        fs.remove( './test/sugarcoat', err => {

            if ( err ) return console.error( err );

            done();
        });
    });
});

suite( 'Parser: parseVarCode', function () {

    var parse
        , config
        ;

    setup( function () {
        config = {
            dest: './documentation',
            sections: [
                {
                    title: 'CSS File',
                    files: './test/assert/parseVarCode.css'
                },
                {
                    title: 'SASS File',
                    files: './test/assert/parseVarCode.scss'
                },
                {
                    title: 'LESS File',
                    files: './test/assert/parseVarCode.less'
                }
            ]
        };
        parse = parser( config );
    });

    test( 'the variable string "--var" is detected and parsed correctly', function () {

        var path = config.sections[ 0 ].files;

        var testPromise = new Promise( ( resolve, reject ) =>{

            fs.readFile( path, 'utf-8', ( err, data ) => {

                if ( err ) return false;
                var value = parse.parseVarCode( data, path );

                return resolve( value );
            });
        });

        return testPromise.then( result => {

            // general
            assert.equal( Array.isArray( result ), true, 'returns an array' );
            assert.equal( result.length, 6, 'parses 6 variables' );

            // 1 red var
            assert.equal( result[ 0 ].variable, '--var1', 'variable is set' );
            assert.equal( result[ 0 ].value, 'red;', 'value is set' );

            // 2 white var
            assert.equal( result[ 1 ].variable, '--var2', 'variable is set' );
            assert.equal( result[ 1 ].value, 'white;', 'value after tab(s) set' );

            // 3 blue var
            assert.equal( result[ 2 ].variable, '--var3', 'variable is set' );
            assert.equal( result[ 2 ].value, 'blue;', 'value is set' );
            assert.equal( result[ 2 ].comment, 'inline comment', '/* inline comment */' );

            // 4 black var
            assert.equal( result[ 3 ].variable, '--var4', 'variable is set' );
            assert.equal( result[ 3 ].value, 'black;', 'value is set' );
            assert.equal( result[ 3 ].comment, 'no space inline comment', '/*inline comment*/' );

            // 5 gold var
            assert.equal( result[ 4 ].variable, '--var5', 'variable is set' );
            assert.equal( result[ 4 ].value, 'gold;', 'value is set' );
            assert.equal( result[ 4 ].comment, 'inline comment', '// inline comment' );

            // 6 purple var
            assert.equal( result[ 5 ].variable, '--var6', 'variable is set' );
            assert.equal( result[ 5 ].value, 'purple;', 'value is set' );
            assert.equal( result[ 5 ].comment, 'no space inline comment', '//inline comment' );
        });
    });

    test( 'the variable string "$" is detected and parsed correctly', function () {

        var path = config.sections[ 1 ].files;

        var testPromise = new Promise( ( resolve, reject ) => {

            fs.readFile( path, 'utf-8', ( err, data ) => {

                if ( err ) return false;
                var value = parse.parseVarCode( data, path );

                return resolve( value );
            });
        });

        return testPromise.then( result => {

            // general
            assert.equal( Array.isArray( result ), true, 'returns an array' );
            assert.equal( result.length, 4, 'parses 4 variables' );

            // 1 red var
            assert.equal( result[ 0 ].variable, '$var1', 'variable is set' );
            assert.equal( result[ 0 ].value, 'red;', 'value is set' );

            // 2 white var
            assert.equal( result[ 1 ].variable, '$var2', 'variable is set' );
            assert.equal( result[ 1 ].value, 'white;', 'value after tab(s) set' );

            // 3 blue var
            assert.equal( result[ 2 ].variable, '$var3', 'variable is set' );
            assert.equal( result[ 2 ].value, 'blue;', 'value is set' );
            assert.equal( result[ 2 ].comment, 'inline comment', '/* inline comment */' );

            // 4 black var
            assert.equal( result[ 3 ].variable, '$var4', 'variable is set' );
            assert.equal( result[ 3 ].value, 'black;', 'value is set' );
            assert.equal( result[ 3 ].comment, 'inline comment', '// inline comment' );
        });
    });

    test( 'the variable string "@" is detected and parsed correctly', function () {

        var path = config.sections[ 2 ].files;

        var testPromise = new Promise( ( resolve, reject ) => {

            fs.readFile( path, 'utf-8', ( err, data ) => {

                if ( err ) return false;
                var value = parse.parseVarCode( data, path );

                return resolve( value );
            });
        });

        return testPromise.then( result => {

            // general
            assert.equal( Array.isArray( result ), true, 'returns an array' );
            assert.equal( result.length, 4, 'parses 4 variables' );

            // 1 red var
            assert.equal( result[ 0 ].variable, '@var1', 'variable is set' );
            assert.equal( result[ 0 ].value, 'red;', 'value is set' );

            // 2 white var
            assert.equal( result[ 1 ].variable, '@var2', 'variable is set' );
            assert.equal( result[ 1 ].value, 'white;', 'value after tab(s) set' );

            // 3 blue var
            assert.equal( result[ 2 ].variable, '@var3', 'variable is set' );
            assert.equal( result[ 2 ].value, 'blue;', 'value is set' );
            assert.equal( result[ 2 ].comment, 'inline comment', '/* inline comment */' );

            // 4 black var
            assert.equal( result[ 3 ].variable, '@var4', 'variable is set' );
            assert.equal( result[ 3 ].value, 'black;', 'value is set' );
            assert.equal( result[ 3 ].comment, 'inline comment', '// inline comment' );
        });
    });
});
