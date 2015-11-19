# sugarcoat #

[![NPM version](https://badge.fury.io/js/sugarcoat.svg)](https://www.npmjs.com/package/sugarcoat) [![Dependency Status](https://david-dm.org/sapientnitrola/sugarcoat.svg)](https://david-dm.org/sapientnitrola/sugarcoat)

Making documentation a bit sweeter ✨

**Note**: This is still a work in-progress. Please file an issue if you encounter any issues or think a feature should be added.


# Index #

  - [Features](#features)
  - [Install](#install)
  - [Usage](#usage)
    - [Module](#module)
    - [CLI](#cli)
  - [Configuration](#configuration)
    - [`settings` Object](#settings-object)
    - [`sections` Array](#sections-array)
  - [Code Comment Syntax](#code-comment-syntax)
  - [Templating](#templating)
    - [Custom Templating](#custom-templating)
  - [Roadmap](#roadmap)


# Features #

**Pattern Library Generator**

- Parses the documentation comments from your code into HTML or JSON
- Accepts comments from any text-based file format (HTML, CSS, JavaScript, SASS, Less, etc.)
- Promotes documentation best-practices for your project
- Includes a default Handlebars template that generates a pattern library

---

**Q&A**

1. Can I use my own template?

   Yes, you can use your own Handlebars template and partials. See the options [`template.layout`](#templatelayout) and [`template.partials`](#templatepartials) for more information.

2. Can you parse css-preprocessor variables?

   Yes, we're able to grab the variables in your Less and SASS files. Just set the `type` option to `variables` appropriate `sections` array.

3. Can I designate the order in which sections rendered the pattern library?

   Yes, Sugarcoat renders each section object in the order in which they're declared in the `sections` array.

4. What if I want to include an entire directory of files?

   Sure, just use a glob pattern in your `files` array

5. What if I don't want to include a specific file?

   Sure, just use a glob pattern with the negation symbol `!` at the beginning of the pattern. See [`section.files`](#files) for a negation example.


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


**Simple Example**

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

Type: `String`  
Optional: `true`  
Default: value of `process.cwd()`

This is the path to which the `dest` path is relative.


### `dest` ###

Type: `String`  
Optional: `true`  
Default: `null`  

Directory to which sugarcoat will output the results. This path is relative to `cwd`. Sugarcoat will create the directory if it does not already exist.


### `json` ###

Type: `Boolean`  
Optional: `true`  
Default: `false`

If set to `true`, sugarcoat will return the parsed data as JSON.


### `log` ###

Type: `Object`  
Optional: `true`  

Configure Sugarcoat's logging properties. See [npm/npmlog](https://github.com/npm/npmlog#loglevel) for more info.


### `template.cwd` ###
 
Type: `String`  
Optional: `true`  
Default: The current working directory will be relative to whereever the `index.js` file is located.  

This is the base path to which all `template` paths are relative to (excluding absolute paths). 


### `template.layout` ###

Type: `String`  
Optional: `true`  
Default: `main.hbs` that is provided by sugarcoat.  

Path (relative to `template.cwd`) to the Handlebars template that will define the layout of the site. If you'd like to provide your own layout file you must also provide a `template.cwd`.


### `template.partials` ###

Type: `Array`  
Optional: `true`  

An array of directory (not file) paths (relative to `template.cwd`) to register with Handlebars. If any partials use a reserved basename (`color`, `typography`, `variable`, `default`, `nav`, `head`, or `footer`), the respective partial will be used instead the one provided by Sugarcoat. If you'd like to provide your own partials the path must be absolute or you must provide a `template.cwd`.


### `template.assets` ###

Type: `Array`  
Optional: `true`  
Default: `sugarcoat`  

An array of directory (not file) paths (relative to `template.cwd`) to the static assets to use instead of the ones provided by Sugarcoat. If you would like to use sugarcoat's assets as well as your own, you may include `sugarcoat` as an asset in the asset array. This will create another directory called `sugarcoat` that will include sugarcoat's provided assets. These directories will be copied into the `dest` directory.


**Advanced Example**

```js
{
  settings: {
    dest: 'demo/documentation/pattern-library',
    template: {
      cwd: 'generators/pattern-library/templates/',
      layout: 'generators/pattern-library/templates/main.hbs',
      partials: [
        'generators/pattern-library/templates/customPartials',
        'generators/pattern-library/templates/moreCustomPartials'
      ],
      assets: [
        'sugarcoat',
        'js',
        'styles',
        'images'
      ]
    },
    json: true, 
    log: {
      level: 'silent'
    }
  }
}
```

**Note**: If you do not put a `dest` string or `json` boolean, sugarcoat will error out. Minimum of one must be present in order for sugarcoat to work.

## `sections` Array ##

Contains an `Array` of [Section Objects](#section-object)

### Section Object ###

#### `title` ####

Type: `String`  
Optional: `false`  

Title of section.


#### `files` ####

Type: `String`|`Object`|`Array`  
Optional: `false`  

Target file(s) that contain comments you would like to be parsed. Sugarcoat's module, `globber.js`, uses  [glob](https://www.npmjs.com/package/glob) which will take a `String`, `Array`, or `Object`. You will need to use a glob pattern inorder to get all the files within a directory. You can also use a negation pattern by using the `!` symbol at the beginning of the path.

**String Examples**

You may include a single file or a directory. The second string example provided will use globber to get all of the files within `demo/library/styles/base/`.

```js
{
    title: 'One File',
    files: 'demo/library/styles/base/feedback.scss'
}
```

```js
{
    title: 'Multiple Files',
    files: 'demo/library/styles/base/*'
}
```

**Object Example**

You may include an object for `files`, that includes `src` and `options`. `src` is a directory and `options` are any specific options you wish to use inorder for globber to get the exact files you are looking for. In the example provided below, the option of `nodir` tells globber to not give us back any of the directories. The glob option `nodir:true` with our glob pattern of `**/*` will allow globber to get us all of the files within `demo/library/styles/base/` and any of its subdirectories. See [Glob](https://www.npmjs.com/package/glob) for all the available glob options. 

```js
{
    title: 'A bunch of files with glob options',
    files: {
      src: 'demo/library/styles/base/**/*'
      options: { nodir: true }
    }
}
```

**Array Example**

If you have multiple files in different directories you will want to use an array. In an array you can include paths to specific files, or you can include directories with glob patterns (or you can mix and match). 

```js
{
    title: 'A bunch of files',
    files: [ 
        'demo/library/styles/global/*.scss',
        'demo/library/styles/base/feedback.scss'
    ]
}
```

**Array with Negation Example**

If you have a directory with multiple files in it that you would like to use you but also have a few files you would like to exclude, you may include a negation pattern to exclude any specifc files.

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

#### `type` ####

Type: `String`  
Optional: `true`  
Default: `default`  

If you'd like sugarcoat to parse a file's variables, use `variables`. This works with any `.scss` or `.less` file. Otherwise, sugarcoat will always use the `default` partial template (unless you chose to provide your own partial).

```js
{
    title: 'Variables',
    files: 'demo/library/styles/global/variables.scss',
    type: 'variables'
}
```

#### `template` ####

Type: `String`  
Optional: `true`  
Default: `variable`  

When used with the above option, `type`sugarcoat declares which partial to use when rendering variables. The default partial is `variable`. Provided alternate renderings include the options `color` or `typography`. If you'd like to designate your own partial, provide a path to your partial. For more information on this, see [Custom Templating](#custom-templating).

```js
{
    title: 'Colors',
    files: 'demo/library/styles/global/colors.scss',
    type: 'variables',
    template: 'color'
}
```

# Code Comment Syntax #

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

- `default.hbs` Default rendering of a comment object.
- `variable.hbs` Renders when `type: 'variables'` and if a `template` has not been provided - A list of variables and its associated value. 
- `color.hbs` Renders when `template: 'color'` - A swatches array with the associated variable name and color.
- `typography.hbs` Renders when `template: `typography` - Fonts and variable names with their examples.

Miscellaneous partials:

- `nav.hbs` Outputs a navigation that maps to each `title` of a section object and each comment object's `@title` tag. This is used in sugarcoat's `main.hbs` layout template.
- `head.hbs` Outputs links to CSS files such as [Furtive](http://furtive.co/) (to style the site a bit), `pattern-lib` (sugarcoat specific css needed for styling the `color` and `typography` template sections), and [Prism](http://prismjs.com/) (to style the code blocks to be more readable). This is used in sugarcoat's `main.hbs` layout template.
- `footer.hbs` Outputs links to JS files such as [Prism](http://prismjs.com/) (to format code blocks). This is used in sugarcoat's `main.hbs` layout template.

## Custom Templating ##

If you'd like to provide your own template, provide a path to the `template.layout` key and a relative path to `template.cwd` in the `settings` object. 

If you'd like to provide one or more of your own partials, provide a directory path to the `partials` key and a relative path to `template.cwd` in the `settings` object. If you'd like to provide more than one directory path, you may do so by putting all of your paths in an array within the `template.partials` key. If you provide sugarcoat with a partial with a basename that is "reserved", sugarcoat will use your partial instead of the one sugarcoat provided. 

"Reserved" basenames:

- color
- typography
- variable
- default
- nav
- head
- footer

# Roadmap #

## v1.0.0 ##
- More styling and better structuring of rendered sections
- Consolidating code comment sytax strategy
- Standardize file globbing

## v?.0.0 ##
- More refactoring of modules (functional, Promises)
- Ability to add custom tags (custom parser functions)
- Add support for JavaScript modules and components (React)
- Add tests (once API is stable)
