Feature List
---

### Configuration Structure: done

Set up a structure that the developer needs to follow when setting up the project.

Please refer to the 'compiler-design.md' file, which is located in the 'notes' folder in the root of the project. 

### Parse Input: done

Find means to parse the data from our CSS, JS and HTML files

Implement these parsers to get the data (ex. pull in comments from JS files) and output them to JSON

- Design module that consumes either a file or directory and outputs all of its contents into an array of files

### Structure Data: done

Gather all of our input data into one place so that it can easily be digested by the tool. This would include not only the parsed input, but also extraneous info from various readme files the developer created.

### Output Data: done

Configure tool to accomplish the following tasks:

- Output readmes
  - Grab markdown files and convert them to html
- Environment Information
  - Take the breakpoints from the options config to generate a breakpoint test page
- Pattern Library
  - Design a template for the pattern library
  - Take HTML comments from components and parse them with 
  - Take CSS comments from UI elements and parse them with
  - Take JS comments from modules and parse them with comment-parse
  - Compile all comments into template
- Research
  - Parse documentation for `research.md` files and output them as html if there are no other `.md` files in the folder.
- Pattern Library Extras
  - Create special template for typography css
  - Create special template for colors swatches css
- Grid System (tentative)