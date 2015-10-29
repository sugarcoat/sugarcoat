# sugarcoat #

Making documentation a bit sweeter.

## Features ##

**Pattern Library Generator**

- Takes comment blocks from designated files and parses them
- Converts comment block content into an AST
- Renders the AST into a Pattern Library

## Install ##

    npm install sugarcoat --save

## Sample Config Object ##

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

### Config Options ###

**settings: {...}**

dest - *(Required)* Folder in which Generate will out put all files. Will create one if it does not already exist. Accepts path with no trailing slash (`/`)

template - *(Optional)* Path of the Handlebars template used during render. Default is `demo/documentation/templates/main.hbs`

partials - *(Optional)* Folder for Handlebars partials to be registered to the Handlebars template. If using the reserved partial basenames of `color`, `typography`, `variable`, or `default`, the associated default partial will be replaced with your custom partial.

**sections: [...]**

title - *(Required)* Title of section.

files - *(Required)* Target file(s) with comments to be parsed. Uses [glob](https://www.npmjs.com/package/glob) and will take a String, Array, or Object (with `src` string or array of files, and an `options` obj)

type - *(Optional)* Declared if variables are used in the file and need to be output to a special format and/or template.

template - *(Optional)* To be used with `type`. Declares which partial to use when rendering variables. The default partial is `variable`. Provided alternate renderings include the options `color` or `typography`

### Sample Comments ###

#### `*.css`, `*.scss`, `*.less` ####

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

#### `*.html` ####

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

# Project Roadmap #

## Guidelines ##

- **Frictionless**: Is this the easiest way to document the feature/module/workflow/etc.? 
- **DRY**: Does the approach cause a duplication of effort?
- **Useful**: Is the information meant to be useful to the developer or the tool?
- **Evergreen**: Does the approach require unrelated effort to just to stay up to date?