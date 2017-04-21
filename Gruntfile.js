module.exports = function ( grunt ) {

    const postcssImport = require( 'postcss-import' );
    const postcssUtilities = require( 'postcss-utilities' );
    const postcssCSSnext = require( 'postcss-cssnext' );
    const postcssPxtorem = require( 'postcss-pxtorem' );
    const postcssUrl = require( 'postcss-url' );
    const cssnano = require( 'cssnano' );

    /* Configure */
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        buildRoot: '/'
    });

    grunt.config( 'eslint', {
        src: [
            'lib/*.js',
            'generators/*.js',
            'generators/pattern-library/**/*.js',
            'grunt/*.js',
            'Gruntfile.js',
            '!generators/pattern-library/examples/**/*.js',
            'test/*.js'
        ]
    });

    grunt.config( 'stylelint', {
        lint: {
            options: {
                debug: true,
                reporters: [
                    {
                        formatter: 'string',
                        console: true
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: 'generators/pattern-library/templates',
                    src: [
                        'styles/**/*.css'
                    ],
                    dest: 'generators/pattern-library/templates',
                    ext: 'styles/**/*.css'
                }
            ]
        }
    });

    grunt.config( 'postcss', {
        options: {
            processors: [
                postcssImport(),
                postcssUtilities(),
                postcssUrl(),
                postcssCSSnext({ browsers: [ 'last 2 versions', 'ie 10' ] }),
                postcssPxtorem(),
                cssnano({ discardComments: { removeAll: true }, autoprefixer: false })
            ]
        },
        dist: {
            src: 'generators/pattern-library/templates/styles/sugarcoat.css',
            dest: 'generators/pattern-library/templates/sugarcoat/css/sugarcoat.css'
        }
    });

    grunt.loadNpmTasks( 'grunt-postcss' );
    grunt.loadNpmTasks( 'grunt-eslint' );
    grunt.loadNpmTasks( 'grunt-stylelint' );

    /* Task aliases */
    grunt.registerTask( 'cssdev', 'Compile CSS files', [
        'stylelint',
        'postcss'
    ]);

    grunt.registerTask( 'lint', 'Lint all files', [
        'eslint',
        'stylelint'
    ]);
};