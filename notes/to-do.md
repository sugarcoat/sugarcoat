1. Configuration Structure
2. Parse Input
3. Structure Data
4. Output Data

Configuration Structure
---

see (compiler-design.md)

Parse Input
---

- Reads in CSS/SASS/LESS comments
- Reads in front-matter (yaml?) (maybe grey-matter)
- Reads in JS comements (yui?)

For each, find:

- Structure that the comments need to be in. Such as title, desc, etc.
- Output format

### CSS

- Topdoc <https://github.com/topcoat/topdoc/>
	- Requires "topdoc" tag in the beginning of a css comment: `/* topdoc */`
- css-parse <https://github.com/reworkcss/css-par se> / <https://github.com/reworkcss/css>
	- A rule-level or declaration-level comment. Comments inside selectors, properties and values etc. are lost.
- yuidoc <http://yui.github.io/yuidoc/>
	- Accepts /* */ in any type of file (CSS in this case)
  - requires documentation in specific form
- Markdown Styleguide Generator <https://github.com/emiloberg/markdown-styleguide-generator>
  - pure example, renders a template from md
  - requires prefixed `/* SOME_VAR */`
  - multiple file extensions
  - outputs javascript object
  - accepts handlebars template