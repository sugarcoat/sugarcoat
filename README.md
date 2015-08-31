# assemble-documentation #

Just an in-progress, non-functioning assemble task to automate documentation creation.

## Guidelines ##

- **Frictionless**: Is this the easiest way to document the feature/module/workflow/etc.? 
- **DRY**: Does the approach cause a duplication of effort?
- **Useful**: Is the information meant to be useful to the developer or the tool?
- **Evergreen**: Does the approach require unrelated effort to just to stay up to date?

## Structure ##

### > Pattern Library ###

The user expects to find any visual style represented in code (HTML/CSS/JS)

**May Contain**

- UI Kit
- Typography
- Color Schemes

**Developer expectation**

Create documentation within the front-matter of an html component or css configuration source

**Compiler expectation**

Parses each html or css front-matter throughout the project into a template. (...)

### > Frameworks ###

Where a developer would describe and define all the frameworks used in their project. It should include links to documentation for each framework

**Examples**

- Bourbon Neat
- Foundation
- Sass Preprocessor

**Developer expectation**

Create a `frameworks.md` file with each framework name, description, language, and link to documentation.

**Compiler expectation**

Adds link to master documentation

### > Account Info ###

Where a developer can go to find all credential configurations.

**Examples**

- Server information
- Font foundry username/password
- Third party vendor credentials

**Developer expectation**

Create an `account-info.md` file with whichever credentials may be required for the project.

**Compiler expectation**

Adds link to master documentation

### > Grid System ###

Where the developer can find an overview of the semantic grid system being used for a project. This may be a third party framework with a link to documentation, or a home grown framework.

**Developer expectation**

Configure the compiler to locate the viewport variables from its css file. Add front-matter to the file that contains viewport variables. (To be decided: How the developer is expected to document a home-grown grid framework)

**Compiler expectation** 

Compiles the file's frontmatter to show either a link to documentation, or example code of how the grid system works.

### > Codestyle ###

Where the developer can find guidelines for syntax and coding conventions specific to a language. 

**Developer expectation**

Create separate files (i.e. `html.md`, `js.md`) that depict the expected style to follow for that specific language.

**Compiler expectation**

Adds links to master documentation

### > Architecture ###

Where the developer can find the agreed-apon approach to various topics.

**Examples**

- Project folder architecture
- Framework-specific architecture (i.e. AngularJS approach)
- Naming conventions (i.e. BEM-style)

**Developer expectation**

Create separate files that describe each architecture.

**Compiler expectation**

Adds links to master documentation

### > Requirements ###

Where the developer can find the expectations and requirements for a project.

**Examples**

- Browser Requirements
- Accessibility level

**Developer expectation**

Create a single file with all requirements.

**Compiler expectation**

Adds links to master documentation

### > Workflows ###

Where the developer can see how specific tasks should be done. This includes first-time setup of a project environment, to handing off code to the client.

**Examples**

- Environment Setup
- JIRA workflow
- Versioning process
- Release process

**Developer expectation**

Multiple files. One for each workflow process. 

**Compiler expectation**

Adds links to master documentation

### > Environment Info ###

The developer should be able to use these tools to test their environment.

**Examples**

- Viewport tests
- PHP/Apache Info

**Developer expectation**

Each folder within will have its own enviornmental test with a `readme.md` as test-specific documentation

**Compiler expectation**

Adds links to master documentation

## Extra Compiler Behaviors ##

### + Boilerplates ###

The developer should be able to create a boilerplate for any given module. This boilerplate should live where the module is expected to be developed.

**Examples**

- Require Module definition
- Page template

**Developer expectation**

Create a boilerplate with front-matter documenting the proper usage of the module.

**Compiler expectation**

Grabs boilerplate front-matter from throughout the project and generates a list of each boilerplate with their appropriate documentation, and locations. (Future feature: compiling the html and required css/js into example pages like in the pattern library)

### + Research (optional) ###

The developer should be able to document their research as the project progresses. The research should be ignored once a decision is made on the associated task

**Examples**

- Preprocessor pros and cons
- Icon fonts vs svg icons
- MVC Framework research

**Developer expectation**

Include a `research.md` file in the appropriate folder.

**Compiler expectation**

Add link to master documentation if the `reasearch.md` file is the only file inside its respective folder. Otherwise, ignore. 

