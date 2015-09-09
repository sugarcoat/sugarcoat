JS Comment Parsers
---

1. **comment-parser**
	- NPM module
	- only supports /** */ comments
	- single or multi line commments supported

2. JSDoc
	- actually runs through the code rather than just the comment block
	- only supports /** */ comments
	- single or multi line comments supported
	- comes with a means of displaying the comments
  - option to output source into templates
  - option to output source into JSON via Haruki:<https://github.com/jsdoc3/jsdoc/tree/master/templates/haruki>

3. YUI Doc
	- bundled with a theme to show comments on a webpage
	- Can be used with any language that supports /* */ comments
	- generates a JSON file
	- can extend with another JSON file to show more data
