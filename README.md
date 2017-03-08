# Sugarcoat #

[![NPM version](https://badge.fury.io/js/sugarcoat.svg)](https://www.npmjs.com/package/sugarcoat) [![Dependency Status](https://david-dm.org/sapientnitrola/sugarcoat.svg)](https://david-dm.org/sapientnitrola/sugarcoat)

Making UI documentation a bit sweeter ✨

Sugarcoat was created to enable developers to produce rich UI documentation easily and with minimal up-keep. Sugarcoat works by parsing project files for documentation comments (similar to JavaDoc, JSDoc, etc.) and generates a responsive HTML site or JSON that is organized and easy to read. Sugarcoat allows developers and designers access to up-to-date previews of UI elements, page components, project specific colors and typography, all in one place.

**Note**: This is still a [work in-progress](#v100). Please file an issue if you encounter any issues or think a feature should be added.

![Screenshot Colors](generators/pattern-library/design/colors.png)

![Screenshot Variables](generators/pattern-library/design/variables.png)

![Screenshot Components](generators/pattern-library/design/components.png)


# Index #

  - [Features](#features)
  - [Install](#install)
  - [Usage](#usage)
    - [Module](#module)
    - [CLI](#cli)
  - [Configuration](#configuration)
    - [`settings` Object](#settings-object)
    - [Advanced `settings` Example](#advanced-settings-example)
    - [`sections` Array](#sections-array)
    - [Standardized File Format](#standardized-file-format)
  - [Code Comment Syntax](#code-comment-syntax)
  - [Templating](#templating)
    - [Custom Templating](#custom-templating)
  - [Example Site](#example-site)
  - [Roadmap](#roadmap)


---

# Features✨ #

1. Lives in your project seamlessly

  Sugarcoat will never force a file/project structure on you, nor make you create extra files for it to work.

2. [Universal Comment Syntax](#code-comment-syntax)

  Sugarcoat parses all **comment blocks** in the file(s) you specify with JSDoc commenting syntax. Or you can specify your own delimiters.

3. [Easy-to-identify component states](#code-comment-syntax)

  If you declare CSS modifier states within your comment block, Sugarcoat will highlight and display them in your pattern library for extra readability.

4. [Variables Galore](#type)

  Sugarcoat will understand your variables if they're SCSS, LESS, or [CSS Custom Property](https://www.w3.org/TR/css-variables/#defining-variables)

5. [Customizable Layout](#custom-templating)

  Sugarcoat allows you to define your own layout, partials and assets.


# Install #

```bash
npm install --save sugarcoat
```


# Usage #

## Module API ##

The Sugarcoat module takes a `config` object and returns a `Promise`. The Promise resolves to the original `config` object, expanded to contain the data from your parsed sections.

```js
const sugarcoat = require( 'sugarcoat' );

sugarcoat( config );

// or

sugarcoat( config ).then( function( data ) {
    console.log( data );
});
```

## CLI ##

You can also install the Sugarcoat command globally (via `npm install -g sugarcoat`). The `sugarcoat` command takes a path to a configuration file which must export the configuration object.

```bash
sugarcoat 'path/to/config.js'
```

**Options**

```bash
sugarcoat [flags] <configuration file>

Options:

  -h, --help     output usage information
  -V, --version  output the version number



# Configuration #


**Simple Example**

```js
{
  settings: {
    dest: 'path/to/dest'
  },
  sections: [
    {
      title: 'Base',
      files: [
        'path/to/styles/typography/*.css'
        'path/to/styles/variables/*.css'
      ]
    },
		{
			title: 'UI',
			files: 'path/to/styles/molecules/**/*.css'
		}
  ]
}
```

## `settings` Object ##

This object holds general configuration values.

### `cwd` ###

  - Type: `String`
  - Optional: `true`
  - Default: `process.cwd()`

Path to which `dest` is relative.

### `dest` ###

  - Type: `String`
  - Optional: `false`
  - Default: `null`
  - Relative: `settings.cwd`

Directory to which Sugarcoat will output the results. This path is relative to `cwd`. Sugarcoat will create any directories that do not already exist.

### `graphic` ###

  - Type: `String`
  - Optional: `true`
  - Default: `null`

Path to the image to be rendered in the heading of your pattern library.

### `log` ###

  - Type: `Object`
  - Optional: `true`

Configure Sugarcoat's logging properties. See [npm/npmlog](https://github.com/npm/npmlog#loglevel) for more info.

### `prefix.assets` ###

  - Type: [Standardized File Format](#standardized-file-format)
  - Optional: `true`
  - Default: `null`
  - Relative: `settings.cwd`

CSS file(s) you wish Sugarcoat to prefix with a selector. The newly prefixed stylesheets will be placed in your document in the order you declare them.

### `prefix.selector` ###

  - Type: `String`
  - Optional: Yes
  - Default: `.sugar-example`

Define the selector to be used to prefix all assets from `prefix.assets`. Should a user choose to develop their own [custom pattern library templates](#custom-templating), they can designate their own selector prefix.

### `template.cwd` ###

  - Type: `String`
  - Optional: `true`
  - Default: Sugarcoat's theme directory

The base path to which all `template` paths are relative.

### `template.layout` ###

  - Type: `String`
  - Optional: `true`
  - Default: `main.hbs` (provided by Sugarcoat)
  - Relative: `template.cwd`

Path to the Handlebars layout that will define the layout of the site.

### `template.partials` ###

Type: [Standardized File Format](#standardized-file-format)
Optional: `true`
Default: See [templating](#templating) for a list of Sugarcoat's provided partials.
Relative: `template.cwd`

Partial file(s) to register with Handlebars. If any partials use a [reserved name](#reserved-partial-names), the respective partial will override the one provided by Sugarcoat.

### `template.assets` ###

Type: [Standardized File Format](#standardized-file-format)
Optional: `true`
Default: `sugarcoat`
Relative: `template.cwd`

Static asset file(s) to copy to `settings.dest`. If you would like to use Sugarcoat's default pattern library assets, as well as your own, just include `sugarcoat` in the asset array.

### `title` ###

  - Type: `String`
  - Optional: `true`
  - Default: `null`

The value displayed as the heading of your pattern library.


##Advanced Settings Example##

```js
module.exports = {
  settings: {
    title: 'My Pattern Library',
    dest: 'my/project/pattern-library',
    graphic: 'my/project/library/images/logo.jpg',
    template: {
      cwd: 'my/project/templates',
      layout: 'my-custom-layout.hbs',
      partials: [
        'partials/folder/*.hbs',
        {
          src: 'my-other-partials',
          options: {
            nodir: false
          }
        }
      ],
      assets: [
        'sugarcoat',
        'js',
        'styles',
        'images'
      ]
    },
    prefix: {
      assets: [
        'styles/**/*'
      ],
      selector: '.scope-styles'
    }
  },
  sections: [ <...> ]
}
```


## `sections` Array ##

Contains an `Array` of [Section Objects](#sectionobject).

### Section Object ###

#### `title` ####

Type: `String`
Optional: `false`

Title of section.

#### `files` ####

Type: [Standardized File Format](#standardized-file-format)
Optional: `false`

File(s) that contain documentation comments you would like to be parsed. Sugarcoat uses [globby](https://www.npmjs.com/package/globby) to enable pattern matching.

#### `type` ####

Type: `String`
Optional: `true`
Default: `default`

If you'd like to parse a preprocessed stylesheet's variables, provide the `variable` option. This works with variables prefixed with `$`, `@`, or `--`.

```js
{
    title: 'Project Defaults',
    files: 'my/project/styles/global/vars.scss',
    type: 'variable'
}
```

#### `template` ####

Type: `String`
Optional: `true`
Default: depends on the value of `type`

The default partial is `section-default`, or `section-variable` when the `type` property is `variable`. Two alternate variable renderings are available: `section-color` and `section-typography`. If you'd like to designate your own partial, provide its name (must first be registered in [`settings.template.partials`](#templatepartials)). For more information on this, see [Custom Templating](#custom-templating).

```js
{
    title: 'Colors',
    files: 'my/project/styles/global/colors.scss',
    type: 'variable',
    template: 'section-color'
}
```

## Standardized File Format ##

Throughout Sugarcoat we use a standardized format for files. This format allows the user to express a file in three different ways: `String`, `Object`, `Array`.

### `String` ###

The `string` format is a string to a path or of a [pattern (Globby)](https://github.com/sindresorhus/globby#globbing-patterns).

**Example**
```js
files: 'my/project/js/*'
```

### `Object` ###

The `object` format is an object composed of a property of `src` and optionaly a property of `options`. The property `src` is a string that is the path to the file or directory. The property `options` is an object with options that will be passed along to [globby](https://www.npmjs.com/package/globby).

**Example**
```js
files: {
  src: 'my/project/js/main.js',
  options: {
    nodir: true
  }
}
```

### `Array` ###

The `array` format can be composed of `strings` or `objects` (or a mix of both). Use the same format for [`string`](#string) and [`object`](#object) as stated above.

**Example**
```js
files: [
  'my/project/js/main.js',
  {
    src: 'my/project/styles',
    options: {
      nodir: true
    }
  }
]
```

# Code Comment Syntax #

Sugarcoat uses [comment-serializer](https://www.npmjs.com/package/comment-serializer) to build the comment object. In general, comment-serializer will convert an `@foo bar baz` statement into:

```js
{
  line: 0,
  tag: 'foo',
  value: 'bar baz',
  valueParsed: []
  source: '@foo bar baz'
}
```

There are three reserved tag names that will notify comment-serializer to parse the value further, and output its results to `valueParsed`:

  - **`@example`** Takes a single or multiline code example

  - **`@modifier`** Is used for a class modifier on a component. It takes the value and splits on the following word, separating the first word as the `type: modifier` and the following string as its `type: description` This modifier can contain any of the following characters: **`.-_`**

  - **`@state`** Is used for state pseudo-classes such as `:hover`. Similar to `@modifier` it splits the state and following description. The state is expected to be prefixed with `:` with `type: modifier`

If you would like to include a custom tag in your comment block, you can pass a custom parser into [comment-serializer](https://github.com/ryanfitzer/comment-serializer#custom-tag-parsers)

Sugarcoat takes the source code that follows a comment (up until the next comment), and applies it to the `context` key of the comment object.


**Comment Example**

```
/**
 * @title Tooltip
 * @example
 *  <div class="tooltip">
 *    <span class="tooltip-content">This is a tooltip</span>
 *  </div>
 * @modifier .active enabled class on .tooltip
 * @state :focus allows visual contrast for accessibility
 */
```

**Comment Object Example**

```js
{
  line: 0,
  preface: ''
  source: '@title Tooltip\n@example\n <div class="tooltip">\n   <span class="tooltip-content">This is a tooltip</span>\n </div>\n@modifier .active enabled class on .tooltip',
  context: '',
  tags: [
    {
      line: 32,
      tag: 'title',
      value: 'Tooltip',
      valueParsed: [],
      source: '@title Tooltip'
    },
    {
      line: 33,
      tag: 'example',
      value: '\n  <div class="tooltip">\n  <span  class="tooltip-content">This is a tooltip</span>\n  </div>',
      valueParsed: [
        {
          type: 'example',
          value: '<div class="tooltip">\n <span class="tooltip-content">This is a tooltip</span>\n </div>'
        },
        {
          type: 'description',
          value: ''
        }
      ],
      source: '@example\n<div class="tooltip">\n <span  class="tooltip-content">This is a tooltip</span>\n </div>'
    },
    {
      line: 37,
      tag: 'modifier',
      value: '.active enabled class on .tooltip',
      valueParsed: [
        {
          type: 'modifier',
          value: '.active'
        },
        {
          type: 'description',
          value: 'enabled  class on .tooltip'
        }
      ],
      source: '@modifier .active enabled class on .tooltip'
    },
    {
      line: 38,
      tag: 'state',
      value: ':focus allows visual contrast for accessibility ',
      valueParsed: [
        {
          type: 'state',
          value: ':focus'
        },
        {
          type: 'description',
          value: 'allows visual contrast for accessibility'
        }
      ],
      source: '@state :focus allows visual contrast for accessibility'
    }
  ]
}
```


**HTML**

For html files, Sugarcoat uses the same comment style. Since HTML doesn't support this style you'll need to wrap your documentation comments with an HTML-style comment. This is to maintain consistency.

**Comment Example (html)**

```html
<!--
/**
 * @title Some Component
 * @description This component has a description
 * @dependencies /library/js/modules/some-component.js
 */
-->
<div class="some-component">
  <span>I'm a Component!</span>
</div>
```

**Comment Object**

```js
{
  line: 0,
  preface: '',
  source: '@title Some Component\n@description This component has an interesting description',
  context: '\n<div class="some-component">\n  <span>I\'m a Component!</span>\n</div>',
  tags: [
    {
      line: 4,
      tag: 'title',
      value: 'Some Component',
      valueParsed: [],
      source: '@title Some Component'
    },
    {
      line: 5,
      tag: 'description',
      value: 'This component has an interesting description',
      valueParsed: [],
      source: '@description This component has an interesting description'
    },
    {
      line: 6,
      tag: 'dependencies',
      value: '/library/js/modules/some-component.js',
      valueParsed: [],
      source: '@dependencies /library/js/modules/some-component.js'
    }
  ]
}
```


# Templating #

Sugarcoat will render each parsed comment object with one of the below partials. The partial will always be the [`template`](#template) string in a Sections object.

  - `section-default` Default rendering of a comment object.

  - `section-variable` Renders when `type: 'variable'` is provided - A list of variables and its associated value.

  - `section-color` Renders when `template: 'section-color'` is provided - A list of color swatches with the associated variable name and color.

  - `section-typography` Renders when `template: 'section-typography'` is provided - Fonts and variable names with their examples.


The following partials are helpers:

  - `nav` Outputs the main navigation - Lists `title` of each section object, nesting each comment object's `@title` tag. Used in the default `main.hbs` layout.

  - `head` Outputs links to Sugarcoat's default stylesheets, and any modified assets from `prefix.assets`

  - `masthead` Renders your project `settings.title` and `settings.graphic` if provided.

  - `footer` Outputs links to JavaScript files.

  - `tag-details`, `file-path`, `block-title` Render data within Sugarcoat's `section-*` partials.


### Reserved Partial Names ###

  - head
  - nav
  - masthead
  - footer
  - preview
  - tag-details
  - file-path
  - block-title
  - section-color
  - section-typography
  - section-variable
  - section-default

## Custom Templating ##

The following options will help to enable your custom Sugarcoat template. None are required.

  - `[template.layout](#templatelayout)`: Replace `main.hbs`
  - `[template.partials](#templatepartials)`: Create new and/or override existing partials
  - `[template.assets](#templateassets)`: Copy assets from your project
  - `[prefix.assets](#prefixassets)`: Sugarcoat can prefix your assets with a selector of your choosing. Should your project provide a scoping process, be sure to include a custom `head.hbs` partial with your modified stylesheets linked.
  - `[prefix.selector](#prefixselector)`: Manage selector for prefixing

**Handlebars Helpers**

The following are included helpers that Sugarcoat has already registered to its instance of Handlebars.

  - `isEqual [string] [string]` Compares two strings. If true, block is rendered
  - `notEqual [string] [string]` Compares two strings. If false, block is rendered
  - `toID [string]` Appends `@index` while within a loop to the string provided

**Custom Comment Tag**

Should you want Sugarcoat to parse a comment block tag in a different way, you can customize its parsing in [comment-serializer](https://github.com/ryanfitzer/comment-serializer#custom-tag-parsers)


# Example Site #

Want to see sugarcoat in action?

  - [Example Project](https://sugarcoat.github.io/sugarcoat-example-project/)
  - [Example Project Pattern Library](https://sugarcoat.github.io/sugarcoat-example-project/documentation/index.html)
  - [Github](https://github.com/sugarcoat/sugarcoat-example-project)

# Roadmap #

## v1.0.0 ##

- [x] [More styling and better structuring of rendered sections]
- [x] [Robust example project]
- [x] [Consolidating code comment syntax strategy]
- [x] [Standardize file syntax in `settings` to align with the `file` syntax in section objects]
- [x] [Consume your style assets, prefix them, and place them into `head.hbs`]
- [ ] [Add automated tests](/../../issues/18)
- [ ] Update github pages
- [ ] Syntax Highlighting
- [ ] [Remove Format option from settings object](../../issues/32)


## v?.0.0 ##

- [x] Ability to add custom tags [comment-parser](https://github.com/ryanfitzer/comment-serializer)
- [ ] More refactoring of modules (functional, Promises)
- [ ] Add support for JavaScript modules and components (React)
