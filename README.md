# sugarcoat #

Making documentation a bit sweeter.

## Features ##

**Pattern Library Generator**

- Takes your already-documented code and creates a readable, auto-generated website.
- Promotes documentation best-practices for your project, beginning to end
- Accepts comments from `.html` and `.css/.less/.scss` files
- Includes a default pattern library template out of the box

---

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


## Install ##

```bash
npm install sugarcoat --save
```

## Sample Config Object ##

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

## Configuration ##

### `settings Object` ###

**`dest` String** - *(Required)* Folder in which sugarcoat will output all files. Sugarcoat will create the folder if it does not already exist. When declaring a folder, use a path with no trailing slash (`/`)

**`template`** String - *(Optional)* Path of the Handlebars template used during render. Default is `demo/documentation/templates/main.hbs`

partials - *(Optional)* Folder for Handlebars partials to be registered to the Handlebars template. If using the reserved partial basenames of `color`, `typography`, `variable`, or `default`, the associated default partial will be replaced with your custom partial.

### `sections Array` ###

Contains an `Array` of section Objects

## Section Object ##

### `title String` ###

*(Required)* Title of section.

### `files Array` ###

*(Required)* Target file(s) with comments to be parsed. Sugarcoat's module, `globber.js`, uses  [glob](https://www.npmjs.com/package/glob) and will take a String, Array, or Object (with `src` string or array of files, and an `options` obj). You can also negate certain patterns by using the `!` symbol at the beginning of the path.

**Negation example**

```js
{
    title: 'A bunch of files',
    files: [ 
        'demo/library/styles/global/*.scss',
        '!demo/library/styles/global/colors.scss'
    ]
    // Excludes demo/library/styles/global/colors.scss from the list of files found in demo/library/styles/global
}
```

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
      options: { /* Glob Options */}
    }
}
```

### `type String` ###

*(Optional)* The default is `default`. If you'd like sugarcoat to parse a file's variables, use `variables`. This works with any `.scss` or `.less` files.

```js
{
    title: 'Variables',
    files: 'demo/library/styles/global/variables.scss',
    type: 'variables'
}
```

### `template String` ###

*(Optional)* Used with the above option, `type`. Declares which partial to use when rendering variables. The default partial is `variable`. Provided alternate renderings include the options `color` or `typography`. If you'd like to designate your own partial, see "Custom Templating"

```js
{
    title: 'Colors',
    files: 'demo/library/styles/global/colors.scss',
    type: 'variables',
    template: 'color'
},
```

## Sample Comments ##

#### `*.css`, `*.scss`, `*.less` ####

```css
/**
 * 
 * @module Tooltip
 * @category Feedback
 * @example
 *    <div class="tooltip">
 *        <span class="tooltip-content">This is a tooltip</span>
 *    </div>
 * @modifier .active enabled class on .tooltip
 * @modifier :hover transition animation
 * 
 */
 
 .tooltip {
     position:relative;
 }
 .tooltip-content {
     position:absolute;
     top:0;
     left:0;
     background-color:rgba(255,255,255,0.5);
     color:blue;
 }
```

#### `*.html` ####

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

# Project Roadmap #

## Guidelines ##

- **Frictionless**: Is this the easiest way to document the feature/module/workflow/etc.? 
- **DRY**: Does the approach cause a duplication of effort?
- **Useful**: Is the information meant to be useful to the developer or the tool?
- **Evergreen**: Does the approach require unrelated effort to just to stay up to date?