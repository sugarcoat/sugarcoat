Features
---

- Compiles 

Pattern Library
---

Takes front matter of css/html/js modules/components and outputs them in a readable, styled way

**Needs**

- does this exist
- location of css files
- location of html component files ?
- css: type of preprocessor (to grab appropriate variables)
- location of colors variables
- what about patterns? are they mixins?- 
- location of typography variables/styles
- location of templates
- where to build library
- where are breakpoints
- mixins: where do they live?
- how do we order ui elements (priority indicator?)

***

**Options**

	patternLibrary: {
		breakpoint: 'demo/library/styles/global/breakpoints.scss'
		srcCSS: 'demo/library/styles/*.scss',
		colors: 'demo/library/styles/global/colors.scss',
		dest: 'demo/documentation/pattern-library'
		preprocessor: 'scss', // 'less'
		srcTemplates: 'demo/documentation/pattern-library/sources/templates'
		// what if its compiled?
		style: 'demo/documentation/pattern-library/sources/library/main.css',
		typography: 'demo/library/styles/global/typography.scss'
	}


Boilerplates
---

Shows list of boilerplates and links to them within the project (output readmes). Might pull description of boilerplate into compiled list

**Needs**

- do we detect boilerplates (no)
- ? is this coupled with pattern library (no)


Environment Info
---

Generates breakpoint test file with specific breakpoints

**Needs**

- does this exist
- where are breakpoints given

***

**Options**

	envInfo: {
		breakpoints: 'demo/library/styles/global/breakpoints.scss'
		// or
		breakpoints: [ '0', '435', '640', '1024', '1153' ]
	}


Output readmes
---

**Topics**

- frameworks
- account info
- architecture
- codestyle
- requirements
- workflows

**Needs**

- does this exist
- folder of readme (non default)
- multiple readmes vs single readme

***

**Options**
	
	// for single document in folder
	frameworks: {
		dest: 'demo/documentation/frameworks,
	}
	
	// for multiple documents in a folder
	codestyle: {
		dest: 'demo/documentation/codestyle,
		src: 'demo/documentation/codestyle
	}


Research
---

**Needs**

- do we look for these?
- name of file (research.md default)

**Options**

	research: {
		replace: true // populates 
	}


