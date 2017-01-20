/**
 * ESLint Configuration
 *
 * @docs http://eslint.org/docs/user-guide/configuring
 */
const config = {};

/**
 * Parser Options
 *
 * @docs http://eslint.org/docs/user-guide/configuring#specifying-parser-options
 */
config.parserOptions = {
    'ecmaVersion': 6,
    'ecmaFeatures': {
        'impliedStrict': true,
        'experimentalObjectRestSpread': true
    }
};

/**
 * Environment
 *
 * @docs http://eslint.org/docs/user-guide/configuring#specifying-environments
 */
config.env = {
    'es6': true,
    'node': true,
    'mocha': true
    // 'browser': true
};

/**
 * Plugins
 *
 * @docs http://eslint.org/docs/user-guide/configuring#using-the-configuration-from-a-plugin
 */
config.plugins = [

    'requirejs'
];

/**
 * Extends
 *
 * @docs http://eslint.org/docs/user-guide/configuring#extending-configuration-files
 */
config.extends = [];

config.globals = {
    'define': true,
    'SNR': true
};
/**
 * Rules
 *
 * All rules can be configured with a "severity" number or string:
 *  0 = 'off'
 *  1 = 'warn'
 *  2 = 'error'
 *
 * @docs http://eslint.org/docs/rules/
 */
config.rules = {};

/**
 * Rules: Possible Errors
 *
 * @docs http://eslint.org/docs/rules/#possible-errors
 */
config.rules[ 'possible-errors' ] = {
    'comma-dangle': [ 2, 'never' ],
    'no-cond-assign': 2,
    'no-console': 0,
    'no-constant-condition': 2,
    'no-control-regex': 2,
    'no-debugger': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': 2,
    'no-empty-character-class': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': 0,
    'no-extra-semi': 2,
    'no-func-assign': 2,
    'no-inner-declarations': [ 2, 'functions' ],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-negated-in-lhs': 2,
    'no-obj-calls': 2,
    'no-prototype-builtins': 0,
    'no-regex-spaces': 2,
    'no-sparse-arrays': 2,
    'no-unexpected-multiline': 0,
    'no-unreachable': 2,
    'no-unsafe-finally': 0,
    'use-isnan': 2,
    'valid-jsdoc': [ 2, {
        // prefer use of @param, @method, @returns, @class
        'prefer': {
            'arg': 'param',
            'argument': 'param',
            'function': 'method',
            'func': 'method',
            'return': 'returns',
            'constructor': 'class',
            'const': 'constant',
            'defaultValue': 'default',
            'property': 'prop',
            'throws': 'exception',
            'augments': 'extends',
            'exception': 'throws',
            'fires': 'emits',
            'desc': '[description at top of block, not tag]',
            'description': '[description at top of block, not tag]'
        },
        // requires a description, use regular expression .+
        'matchDescription': '.+',
        // return: required if and only if the function or method has a return statement
        'requireReturn': false,
        // return: require type
        'requireReturnType': true,
        // return: require description
        'requireReturnDescription': false,
        // param: require description
        'requireParamDescription': true
    } ],
    'valid-typeof': 2
};

/**
 * Rules: Best Practices
 *
 * @docs http://eslint.org/docs/rules/#best-practices
 */
config.rules[ 'best-practices' ] = {
    'accessor-pairs': 0,
    'array-callback-return': 0,
    'block-scoped-var': 0,
    'complexity': [ 0, 11 ],
    'consistent-return': 0,
    'curly': [ 2, 'multi-line' ],
    'default-case': 0,
    'dot-location': 0,
    'dot-notation': [ 0, { 'allowKeywords': true } ],
    'eqeqeq': 2,
    'guard-for-in': 0,
    'no-alert': 0,
    'no-caller': 2,
    'no-case-declarations': 0,
    'no-div-regex': 0,
    'no-else-return': 0,
    'no-empty-function': 0,
    'no-empty-pattern': 0,
    'no-eq-null': 0,
    'no-eval': 0,
    'no-extend-native': 0,
    'no-extra-bind': 0,
    'no-extra-label': 0,
    'no-fallthrough': 2,
    'no-floating-decimal': 0,
    'no-implicit-coercion': 0,
    'no-implicit-globals': 0,
    'no-implied-eval': 0,
    'no-invalid-this': 0,
    'no-iterator': 0,
    'no-labels': 0,
    'no-lone-blocks': 0,
    'no-loop-func': 0,
    'no-magic-numbers': 0,
    'no-multi-spaces': 0,
    'no-multi-str': 0,
    'no-native-reassign': 0,
    'no-new': 0,
    'no-new-func': 0,
    'no-new-wrappers': 0,
    'no-octal': 2,
    'no-octal-escape': 0,
    'no-param-reassign': 0,
    'no-proto': 0,
    'no-redeclare': 2,
    'no-return-assign': 0,
    'no-script-url': 0,
    'no-self-assign': 0,
    'no-self-compare': 0,
    'no-sequences': 0,
    'no-throw-literal': 0,
    'no-unmodified-loop-condition': 0,
    'no-unused-expressions': 0,
    'no-unused-labels': 0,
    'no-useless-call': 0,
    'no-useless-concat': 0,
    'no-useless-escape': 0,
    'no-void': 0,
    'no-warning-comments': 0,
    'no-with': 2,
    'radix': 0,
    'vars-on-top': 0,
    'wrap-iife': 0,
    'yoda': 0
};

/**
 * Rules: Variables
 *
 * @docs http://eslint.org/docs/rules/#variables
 */
config.rules[ 'variables' ] = {
    'init-declarations': 0,
    'no-catch-shadow': 0,
    'no-delete-var': 2,
    'no-label-var': 0,
    'no-restricted-globals': 0,
    'no-shadow': 0,
    'no-shadow-restricted-names': 0,
    'no-undef': 2,
    'no-undef-init': 0,
    'no-undefined': 0,
    'no-unused-vars': [ 2, { 'vars': 'all', 'args': 'none' } ],
    'no-use-before-define': 0
};

/**
 * Rules: Node.js and CommonJS
 *
 * @docs http://eslint.org/docs/rules/#nodejs-and-commonjs
 */
config.rules[ 'nodejs-and-commonjs' ] = {
    'callback-return': 0,
    'global-require': 0,
    'handle-callback-err': 0,
    'no-mixed-requires': 0,
    'no-new-require': 0,
    'no-path-concat': 0,
    'no-process-env': 0,
    'no-process-exit': 0,
    'no-restricted-modules': 0,
    'no-sync': 0
};

/**
 * Rules: Stylistic Issues
 *
 * @docs http://eslint.org/docs/rules/#stylistic-issues
 */
config.rules[ 'stylistic-issues' ] = {
    'array-bracket-spacing': [ 2, "always", { "objectsInArrays": false } ],
    'block-spacing': 2,
    'brace-style': [ 2, 'stroustrup' ],
    'camelcase': [ 2, { properties: "never" } ],
    'comma-spacing': [ 2, { 'before': false, 'after': true } ],
    'comma-style': 0,
    'computed-property-spacing': 0,
    'consistent-this': 0,
    'eol-last': 0,
    'func-names': 0,
    'func-style': 0,
    'id-blacklist': 0,
    'id-length': 0,
    'id-match': 0,
    'indent': [ 2, 4, { 'SwitchCase': 1 } ],
    'jsx-quotes': 0,
    'key-spacing': [ 2, { 'afterColon': true, 'beforeColon': false } ],
    'keyword-spacing': [ 'error', { 'before': true, 'after': true, 'overrides': {} }  ],
    'linebreak-style': [ 2, 'unix' ],
    'lines-around-comment': 0,
    'max-depth': 0,
    'max-len': 0,
    'max-lines': 0,
    'max-nested-callbacks': 0,
    'max-params': 0,
    'max-statements': 0,
    'max-statements-per-line': 0,
    'new-cap': [ 2, { 'properties': false } ],
    'new-parens': 0,
    'newline-after-var': 0,
    'newline-before-return': 2,
    'newline-per-chained-call': 0,
    'no-array-constructor': 0,
    'no-bitwise': 2,
    'no-continue': 0,
    'no-inline-comments': 0,
    'no-lonely-if': 0,
    'no-mixed-operators': 0,
    'no-mixed-spaces-and-tabs': 2,
    'no-multiple-empty-lines': [ 2, { 'max': 2 } ],
    'no-negated-condition': 0,
    'no-nested-ternary': 0,
    'no-new-object': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-spaced-func': 2,
    'no-ternary': 0,
    'no-trailing-spaces': 2,
    'no-underscore-dangle': 2,
    'no-unneeded-ternary': 0,
    'no-whitespace-before-property': 2,
    'object-curly-newline': 0,
    'object-curly-spacing': [ 2, 'always' ],
    'object-property-newline': 0,
    'one-var': 0,
    'one-var-declaration-per-line': 0,
    'operator-assignment': 0,
    'operator-linebreak': 0,
    'padded-blocks': 0,
    'quote-props': 0,
    'quotes': [ 2, 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true } ],
    'require-jsdoc': 0,
    'semi': [ 2, 'always' ],
    'semi-spacing': [ 2, { 'before': false, 'after': true } ],
    'sort-vars': 0,
    'space-before-blocks': [ 2, 'always' ],
    'space-before-function-paren': [ 2, { 'anonymous': 'always', 'named': 'never' } ],
    'space-in-parens': 0,
    'space-infix-ops': 2,
    'space-unary-ops': [ 2, { 'words': true, 'nonwords': false, 'overrides': { '!': false, '!!': false, '++': false }  } ],
    'spaced-comment': [ 2, 'always', {
        "exceptions": [
            "-",
            "+",
            "*",
            "!"
        ],
        "markers": [
            ">>excludeStart(",
            ">>excludeEnd("
        ]
    }],
    'unicode-bom': 0,
    'wrap-regex': 0
};

/**
 * Rules: ECMAScript 6
 *
 * @docs http://eslint.org/docs/rules/#ecmascript-6
 */
config.rules[ 'ecmascript-6' ] = {
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'arrow-spacing': 0,
    'constructor-super': 0,
    'generator-star-spacing': 0,
    'no-class-assign': 0,
    'no-confusing-arrow': [ 2, { 'allowParens': true } ],
    'no-const-assign': 2,
    'no-dupe-class-members': 0,
    'no-duplicate-imports': 0,
    'no-new-symbol': 0,
    'no-restricted-imports': 0,
    'no-this-before-super': 0,
    'no-useless-computed-key': 0,
    'no-useless-constructor': 0,
    'no-useless-rename': 0,
    'no-var': 0,
    'object-shorthand': 0,
    'prefer-arrow-callback': 0,
    'prefer-const': 0,
    'prefer-reflect': 0,
    'prefer-rest-params': 0,
    'prefer-spread': 0,
    'prefer-template': 2,
    'require-yield': 0,
    'rest-spread-spacing': [ 2, 'never' ],
    'sort-imports': 0,
    'template-curly-spacing': 0,
    'yield-star-spacing': 0
};

config.rules[ 'plugin:requirejs' ] = {
    'requirejs/no-invalid-define': 2,
    'requirejs/no-multiple-define': 2,
    'requirejs/no-named-define': 2,
    'requirejs/no-object-define': 1,
    'requirejs/amd-function-arity': 2
};

config.rules = Object.keys( config.rules ).reduce( ( rules, section ) => {

    Object.assign( rules, config.rules[ section ] );

    return rules;
}, {});

module.exports = config;