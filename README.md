# sugarcoat #

[![NPM version](https://badge.fury.io/js/sugarcoat.svg)](https://www.npmjs.com/package/sugarcoat) [![Dependency Status](https://david-dm.org/sapientnitrola/sugarcoat.svg)](https://david-dm.org/sapientnitrola/sugarcoat)

Making documentation a bit sweeter ✨

**Note**: This is still a work in-progress. Please file an issue if you encounter any bugs or think a feature should be added. 


# Index #

  - [Features](#features)
  - [Install](#install)
  - [Usage](#usage)
    - [Module](#module)
    - [CLI](#cli)
  - [Configuration](#configuration)
    - [`settings` Object](#settings-object)
    - [`sections` Array](#sections-array)
  - [DocBlock Comments](#docblock-comments)
  - [Templating](#templating)
    - [Custom Templating](#custom-templating)
  - [TODO](#todo)


# Features #

**Pattern Library Generator**

- Takes your already-documented code and creates a readable, auto-generated website
- Promotes documentation best-practices for your project, beginning to end
- Accepts comments from `.html` and `.css/.less/.scss` files
- Includes a default pattern library template out of the box

---

**Q&A**

1. Can I use my own template?

   Yes, you can use your own template, and even your own partials. See the options `template` and `partials`

2. Can you parse special variables?

   Yes, we're able to grab `.less` and `.scss` variables when you use the option `type` in a `sections` object.

3. Can I designate the order of the library?

   Yes, sugarcoat renders each section object in the order in which they're declared

4. What if I want to include an entire folder?

   Sure, just use a globbing pattern in your `files` array

5. What if I don't want to include a specific file?

   Yup, just use a globbing pattern with the negation symbol `!` at the beginning of the pathname


# Install #

```bash
npm install sugarcoat --save
```


# Usage #

## Module ##

The `sugarcoat` method takes a `config` object and an `options` object and returns a `Promise`. The `resolve` callback provided to the `.then` method recieves the full data object of parsed sections.

```js
var sugarcoat = require( 'sugarcoat' );

sugarcoat( config, options ).then( function( data ) {
    // do something with data
});
```

## CLI ##

You can also install `sugarcoat` globally (via `npm install -g`). The `sugarcoat` command takes a path to a configuration file which must export the configuration object via `module.exports`.

```bash
sugarcoat "./my/config.js"
```


# Configuration #


**Example**

```js
{
  settings: {
    dest: 'demo/documentation/pattern-library'
  },
  sections: [
    {
      title: 'Components',
      files: 'demo/components/*.html'
    },
    {
      title: 'UI Kit',
      files: [
        'demo/library/styles/global/*.scss',
        '!demo/library/styles/global/typography.scss',
        'demo/library/styles/base/feedback.scss'
      ]
    }
  ]
}
```

## `settings` Object ##

### `cwd` ###
*(Optional)*

Type: `String` 
Default: value of `process.cwd()`

This is the path to which the `dest` path is relative.


### `dest` ###
*(Optional)*

Type: `String`
Default: `null`

Directory to which sugarcoat will output the results. This path is relative to `cwd`. Sugarcoat will create the directory if it does not already exist.


### `json` ###
*(Optional)*

Type: `Boolean`
Default: `false`

If set to `true`, sugarcoat will return the parsed data as JSON.


### `log` ###
*(Optional)*

Type: Object

Configure Sugarcoat's logging properties. See [npm/npmlog](https://github.com/npm/npmlog#loglevel) for more info.


**`template.cwd` String** - *(Optional)* This is the base path to which all `template` paths relative (excluding absolute paths). 

**`template.layout` String** - *(Optional)* Path (relative to `template.cwd`) to the Handlebars layout template instead the one provided by Sugarcoat.

**`template.partials` Array** - *(Optional)* An array directory (not file) paths (relative to `template.cwd`) to register with Handlebars. If any partials use a reserved basename (`color`, `typography`, `variable`, or `default`), the respective partial will be used instead the one provided by Sugarcoat.

**`template.assets` Array** - *(Optional)* An array directory (not file) paths (relative to `template.cwd`) to the static assets to use instead of the ones provided by Sugarcoat. These directories will be copied into the `dest` directory.

**Note**: If you do not put a `dest` string or `json` boolean, sugarcoat will error out. Minimum of one must be present in order for sugarcoat to work.

**Example**

```js
{
  settings: {
    dest: 'demo/documentation/pattern-library',
    layout: 'generators/pattern-library/templates/main.hbs',
    partials: 'generators/pattern-library/templates/customPartials',
    json: true, 
    loglevel: 'silent'
  }
}
```

## `sections` Array ##

Contains an `Array` of [Section Objects](#section-object)

---

### Section Object ###

#### `title` String ####

*(Required)* Title of section.

#### `files` Array ####

*(Required)* Target file(s) that contain comments you'd like to be parsed. Sugarcoat's module, `globber.js`, uses  [glob](https://www.npmjs.com/package/glob) and will take a `String`, `Array`, or `Object`. You can also use a negation pattern by using the `!` symbol at the beginning of the path.

**String example**

```js
{
    title: 'One File',
    files: 'demo/library/styles/base/feedback.scss'
}
```

**Object example**

```js
{
    title: 'A bunch of files with glob options',
    files: {
      src: 'demo/library/styles/base/feedback.scss'
      options: { /* glob Options */}
    }
}
```

**Negation example**

```js
{
    title: 'A bunch of files',
    files: [ 
        'demo/library/styles/global/*.scss',
        '!demo/library/styles/global/colors.scss'
    ]
    // Excludes demo/library/styles/global/colors.scss
    // from the list of files found in demo/library/styles/global
}
```

#### `type` String ####

*(Optional)* If you'd like sugarcoat to parse a file's variables, use `variables`. This works with any `.scss` or `.less` files. Otherwise, sugarcoat will always use the `default` partial template

```js
{
    title: 'Variables',
    files: 'demo/library/styles/global/variables.scss',
    type: 'variables'
}
```

#### `template` String ####

*(Optional)* Used with the above option, `type`. Declares which partial to use when rendering variables. The default partial is `variable`. Provided alternate renderings include the options `color` or `typography`. If you'd like to designate your own partial, see [Custom Templating](#custom-templating)

```js
{
    title: 'Colors',
    files: 'demo/library/styles/global/colors.scss',
    type: 'variables',
    template: 'color'
}
```

# DocBlock Comments #

Sugarcoat's `parser.js` module adds some additional parsing functionality to [comment-parse](https://www.npmjs.com/package/comment-parser) to build its AST comment object. The following are reserved tags:

- **`@title`** The name of the module. Sugarcoat uses this tag in its default navigation template
- **`@example`** Takes a single or multiline code example
- **`@modifier`** Takes the following word and adds it as the `name` key in the tag object. The word can be prefixed with any of the following characters: **`:.#`**

**Comment Example**

```css
/**
 * 
 * @title Tooltip
 * @category Feedback
 * @example
 *    <div class="tooltip">
 *        <span class="tooltip-content">This is a tooltip</span>
 *    </div>
 * @modifier .active enabled class on .tooltip
 * 
 */
```

**Comment Object (AST)**

```js
{ 
  line: 0,
  description: '',
  source: '@title Tooltip\n@example\n     <div class="tooltip">\n         <span class="tooltip-content">This is a tooltip</span>\n     </div>\n@modifier .active enabled class on .tooltip',
  context: '',
  tags: [ 
    { 
      tag: 'title',
      description: 'Tooltip',
      optional: false,
      type: '',
      name: '',
      line: 3,
      source: '@title Tooltip'
    },
    { 
      tag: 'example',
      description: '<div class="tooltip">\n<span class="tooltip-content">This is a tooltip</span>\n</div>',
      optional: false,
      type: '',
      name: '',
      line: 4,
      source: '@example\n<<div class="tooltip">\n<span class="tooltip-content">This is a tooltip</span>\n</div>' 
    },
    { 
      tag: 'modifier',
      name: '.active ',
      description: 'enabled class on .tooltip',
      optional: false,
      type: '',
      line: 10,
      source: '@modifier .active enabled class on .tooltip' 
    }
  ]
}
```

**HTML**

When parsing html-based markup, Sugarcoat will take the code following a comment, and apply it to the `context` key of the comment object.

**Comment Example (html)**

```html
<!--
/**
 *
 * @title Some Component
 * @description This component has a description
 * @dependencies /library/js/modules/some-component.js, /library/js/modules/other-component.js
 *
 */
-->

<div class="some-component">
  <span>I'm a Component!</span>
</div>
```

**Comment Object (AST)**

```js
{
  line: 0,
  description: '',
  source: '@title Some Component\n@description This component has an interesting description\n@dependencies /library/js/modules/some-component.js',
  context: '\n<div class="some-component">\n  <span>I\'m a Component!</span>\n  <!-- I\'m an inline comment! -->\n</div>\n\n',
  tags: [ 
    { 
      tag: 'title',
      description: 'Some Component',
      optional: false,
      type: '',
      name: '',
      line: 2,
      source: '@title Some Component'
    },
    { 
      tag: 'description',
      description: 'This component has an interesting description',
      optional: false,
      type: '',
      name: '',
      line: 3,
      source: '@description This component has an interesting description'
    },
    { 
      tag: 'dependencies',
      description: '/library/js/modules/some-component.js',
      optional: false,
      type: '',
      name: '',
      line: 4,
      source: '@dependencies /library/js/modules/some-component.js'
    }
  ]
}
```

# Templating #

Sugarcoat provides a default template for your pattern library. Each comment object found by sugarcoat will render using one of the following partials:

- `default.hbs` Default rendering of a comment object
- `variable.hbs` Renders when `type: 'variables'` - A list of variables and its associated value. If a `template` is not provided with the section object, it will use this partial
- `color.hbs` Renders when `template: 'color'` - A swatches array with the associated variable name and color
- `typography.hbs` Renders when `template: `typography` - Fonts and variable names with their examples

Miscellaneous partials:

- `nav.hbs` Outputs a navigation that maps to each `title` of a section object and each comment object's `@title` tag

## Custom Templating ##

If you'd like to provide your own template, simply provide a path to the `layout` key in the `settings` object. 

If you'd like to provide one or more of your own partials, provide a directory path to the `partials` key in the `settings.template` object. If you provide sugarcoat with a partial with a basename that is "reserved", sugarcoat will use yours instead.

"Reserved" basenames:

- nav
- default
- variable
- color
- typography


# TODO #

- More refactoring of module structure (globber, parser, renderer)
- Ability to add custom tags (custom parser functions)
- More styling and better structuring of rendered sections
- Inject elements/components css for real previews
- Add JavaScript modules/components example
- Add tests (once API is a little more stable)
