'use strict';

var assert = require( 'chai' ).assert;

var sugarcoat = require( '../lib/index' );

suite( 'Glob files', function () {
    // test globfile function in index file
    // test if sections file path (that includes multiple files) globs the files properly

    test.only( 'Sugarcoat globs our file paths correctly.', function (done) {

        var globFilesConfig = {
            dest: './test/sugarcoat',
            sections: [
                {
                    title: 'CSS Files',
                    files: [
                        // '!./test/assert/prefixAssets-assert.css',
                        '!./test/assert/parseComment.css',
                        './test/assert/*.css'
                        // '!./test/assert/configPartial.hbs',
                        // './test/assert/*.hbs'
                    ]
                }
            ]
        };

        sugarcoat( globFilesConfig )
        .then( data => {

            var fileData = data.sections[ 0 ];

            console.log(fileData);
            done();

        }, data => {

            // assert.isString( data, 'error is not an obj' );
            console.log('HERRRO', data);
            done();
        });
    });
});

suite( 'Read Sections', function () {

    test( 'Sugarcoat is converting our section file string into an object with the correct data.', function () {

        var readSectionsConfig = {
            dest: './test/sugarcoat',
            sections: [
                {
                    title: 'Colors File',
                    files: './test/assert/readSections.css'
                }
            ]
        };

        var sectionFilePath = './test/assert/readSections.css'
            , sectionFileExt = 'css'
            , sectionFileSrc = '/**\n *\n * @title Primary Colors\n * @description Client-branded color palette\n * @usage Found only in brand-specific UI elements\n *\n */\n:root {\n    --brand-red: #703030; /* Headlines */\n    --brand-grey: #2F343B; /* Links */\n    --accent-red: #C77966;\n    --accent-grey: #7E827A;\n}'
            ;

        sugarcoat( readSectionsConfig )
        .then( data => {

            var fileData = data.sections[ 0 ].files[ 0 ];

            assert.isObject( fileData, 'The data in the files array is an object.' );
            assert.propertyVal( fileData, 'path', sectionFilePath, 'The sections file path is correct.' );
            assert.propertyVal( fileData, 'ext', sectionFileExt, 'The sections file ext is correct.' );
            assert.propertyVal( fileData, 'src', sectionFileSrc, 'The sections file src is correct.' );

        }, data => {

            assert.isNotObject( data, 'error is not an obj' );
        });
    });
});
