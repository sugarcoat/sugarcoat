# Sugarcoat #

[![NPM version](https://badge.fury.io/js/sugarcoat.svg)](https://www.npmjs.com/package/sugarcoat) [![Dependency Status](https://david-dm.org/sapientnitrola/sugarcoat.svg)](https://david-dm.org/sapientnitrola/sugarcoat)

Making UI documentation a bit sweeter ✨

Sugarcoat was created to enable developers to produce rich UI documentation easily and with minimal up-keep. Sugarcoat works by parsing project files for documentation comments (similar to JavaDoc, JSDoc, etc.) and generates a responsive HTML site or JSON that is organized and easy to read. Sugarcoat allows developers and designers access to up-to-date previews of UI elements, page components, project specific colors and typography, all in one place.

**Note**: This is still a [work in-progress](#v100). Please file an issue if you encounter any issues or think a feature should be added.

![Screenshot Colors](screenshots/colors.png)

![Screenshot Variables](screenshots/variables.png)

![Screenshot Components](screenshots/components.png)
See our [example project](https://github.com/sugarcoat/sugarcoat-example-project) to get a better view of Sugarcoat up and running.


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


# Install #

```bash
npm install --save sugarcoat
```


# Usage #


The Sugarcoat module takes a `config` object and returns a `Promise`. By default, the `resolve` callback provided to the `.then` method receives the expanded `config` object with the parsed sections data. If there are any errors within Sugarcoat, it will reject the promise, passing back the first error as an `Error` object. The user can then handle the error as needed. (It is easiest if a `.catch` is added to end of the sugarcoat promise which will catch any errors.)


```js
const sugarcoat = require( 'sugarcoat' );

sugarcoat( config ).catch( errorObj => {
  // handle errors here
});

// or

sugarcoat( config ).then( data => {
    console.log( data );
}).catch( errorObj => {
  // handle errors here
});
```

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

  - Required: No
  - Type: `String`
  - Default: `process.cwd()`

Path to which `dest` is relative.

### `dest` ###

  - Required: Yes
  - Type: `String`
  - Default: `null`
  - Relative: `settings.cwd`

Directory to which Sugarcoat will output the results. This path is relative to `cwd`. Sugarcoat will create any directories that do not already exist. If given the option 'none', Sugarcoat will not output a rendered pattern library. 

### `graphic` ###

  - Required: No
  - Type: `String`
  - Default: `null`

Path to the image to be rendered in the heading of your pattern library.

### `log` ###

  - Required: No
  - Type: `Object`

Configure Sugarcoat's logging properties. See [npm/npmlog](https://github.com/npm/npmlog#loglevel) for more info.

### `prefix.assets` ###

  - Required: No
  - Type: [Standardized File Format](#standardized-file-format)
  - Default: `null`
  - Relative: [`settings.cwd`](#cwd)

CSS file(s) you wish Sugarcoat to prefix with `prefix.selector`. The newly prefixed stylesheets will be placed in your document in the order you declare them.

### `title` ###

  - Required: No
  - Type: `String`
  - Default: 'Pattern Library'

The value displayed as the heading of your pattern library.


## `sections` Array ##

Contains an `Array` of [Section Objects](#section-object).

### Section Object ###

Each section object in the sections array is rendered as a category. Each comment block within all files in your section object is rendered as a subcategory. You can modify the `mode` Sugarcoat uses to parse the files in your section object, as well as the `template` it uses to render the parsed data.

### `files` ###

  - Required: Yes
  - Type: [Standardized File Format](#standardized-file-format)

File(s) to parse for [documentation comments](#code-comment-syntax). Sugarcoat uses [globby](https://www.npmjs.com/package/globby) to enable pattern matching.


### `title` ###

  - Required: Yes
  - Type: `String`

Heading of the section.

### `mode` & `template` ###

#### `mode` ####

  - Required: No
  - Type: `String`
  - Default: `undefined`

By default, all files are parsed only for their comment blocks. By using `'variable'` mode, Sugarcoat will parse your stylesheet's variable declarations as well. This works with variables prefixed with `$`, `@`, or `--`, depending on the stylesheet's file extension.

#### `template` ####

  - Required: No
  - Type: `String`
  - Default: `'section-default'`

The default partial name used to display parsed comments is `section-default`. If `mode` is provided, the default partial name used is `section-variable`. `mode` has two alternate variable renderings available: `section-color` and `section-typography`.

**Relationship Table**

| `mode`     | Default `template` | Alternate `template` | Description       |
|------------|--------------------|----------------------|-------------------|
| undefined  | 'section-default'  |                      | Parse comment block only |
| 'variable' | 'section-variable' |                      | Parse file content for variables and renders a simple table. Inline comments are treated as the variable's description. Groups of variables can be divided in a file by a comment block. |
| 'variable' |                    | 'section-color'      | Same as 'section-variable', except variables are rendered as swatches |
| 'variable' |                    | 'section-typography' | Same as 'section-variable', except font-family styles are applied to sample text |


**Examples**

Parse all variables in my file:

```js
{
    title: 'Project Defaults',
    files: 'path/to/global/vars.scss',
    mode: 'variable'
}
```

Parse all variables in my file and render them using the 'section-color' partial:

```js
{
    title: 'Colors',
    files: 'path/to/global/colors.scss',
    type: 'variable',
    template: 'section-color'
}
```


## Standardized File Format ##

Throughout Sugarcoat we use a standardized format for files. This format allows the user to express a file in three different ways: `String`, `Array`, and `Object`.

### `String` ###

A path or pattern [(Globby)](https://github.com/sindresorhus/globby#globbing-patterns) to a location.

**Example**
```js
files: 'path/to/js/*'
```

### `Array` ###

Provide a series of Standardized File Formats ([`Strings`](#string) and/or [`Objects`](#object)).

**Example**
```js
files: [
  'path/to/main.js',
  {
    src: 'path/to/main.js',
    options: {
      nodir: true
    }
  }
]
```

### `Object` ###

Provide more globbing options in addition to the standardized patterns. See [Globby](https://github.com/sindresorhus/globby).


**Example**
```js
files: {
  src: 'path/to/main.js',
  options: {
    nodir: true
  }
}
```

# Code Comment Syntax #

```css
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


Sugarcoat will parse any tag it finds into a key/value pair. For example: `@tag value`.

The exception being the following three reserved tags that are demonstrated in the above example:

  - **`@example`** Takes a single or multiline code example.

  - **`@modifier`** Used for a class modifier on a component: `@modifier <selector> <description>`.

  - **`@state`** Used for state pseudo-classes such as `:hover`: `@state :<pseudo-class> <description>`.


**HTML**

For html files, Sugarcoat uses the same comment style. Since HTML doesn't support this style you'll need to wrap your documentation comments with an HTML-style comment.

**Comment Example (html)**

```html
<!--
/**
 * @title Some Component
 * @description This component has a description
 * @dependencies /path/to/some-component.js
 */
-->
<div class="some-component">
  <span>I'm a Component!</span>
</div>
```
