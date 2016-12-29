/**
 * Stylelint Configuration
 *
 * Documentation: https://github.com/stylelint/stylelint
 * Rules documentation: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
 */
module.exports = {
    ignoreFiles: 'generators/pattern-library/templates/styles/base/normalize.scss',
    'rules': {

        // https://github.com/stylelint/stylelint/tree/master/src/rules/indentation
        'indentation': 4,

        // https://github.com/stylelint/stylelint/blob/master/src/rules/selector-list-comma-newline-after/README.md
        'selector-list-comma-newline-after': 'always',

        // https://github.com/stylelint/stylelint/blob/master/src/rules/value-list-comma-space-after/README.md
        'value-list-comma-space-after': 'always',

        'function-comma-space-after': 'always',

        // https://github.com/stylelint/stylelint/blob/master/src/rules/declaration-colon-space-after/README.md
        'declaration-colon-space-after': 'always',

        // https://github.com/stylelint/stylelint/blob/master/src/rules/block-opening-brace-space-before/README.md
        'block-opening-brace-space-before': 'always',

        // https://github.com/stylelint/stylelint/blob/master/src/rules/function-url-quotes/README.md
        'function-url-quotes': 'never',

        // https://github.com/stylelint/stylelint/blob/master/src/rules/block-no-empty/README.md
        'block-no-empty': true,

        // https://github.com/stylelint/stylelint/blob/master/src/rules/block-no-single-line/README.md
        'block-no-single-line': true,

        // https://github.com/stylelint/stylelint/blob/master/src/rules/selector-max-compound-selectors/README.md
        'selector-max-compound-selectors': [
            4,
            {
                'message': 'Please limit the use of compound selectors',
                'severity': 'warning'
            }
        ],

        // https://github.com/stylelint/stylelint/blob/master/src/rules/max-nesting-depth/README.md
        'max-nesting-depth': 1,

        // https://github.com/stylelint/stylelint/blob/master/src/rules/declaration-no-important/README.md
        'declaration-no-important': true,

        // https://github.com/stylelint/stylelint/blob/master/src/rules/stylelint-disable-reason/README.md
        'stylelint-disable-reason': 'always-after',

        //https://github.com/stylelint/stylelint/blob/master/src/rules/no-descending-specificity/README.md
        'no-descending-specificity': true
    }
};