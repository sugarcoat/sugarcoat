Pattern Library
---

Takes front matter of css/html/js modules/components and outputs them in a readable, styled way

**Needs**

- does this exist
- location of css files
- location of html component files ?
- css: type of preprocessor (to grab appropriate variables)
- location of colors variables
- location of typography variables/styles
- location of templates
- where to build library
- where are breakpoints

****

**Options**

	patternLibrary: {
		breakpoints: 'demo/library/styles/global/breakpoints.scss'
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

Renders both js and html boilerplates into a pattern library?

**Needs**

- do we detect boilerplates
- ? is this coupled with pattern library


Environment Info
---

Generates breakpoint test file with specific breakpoints

**Needs**

- does this exist
- where are breakpoints given


Output readmes
---

**Folders**

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

****

**Options**

	frameworks: {
		dest: 'demo/documentation/frameworks,
		src: 'demo/documentation/frameworks/readme.md'
	}
	
	codestyle: {
		dest: 'demo/documentation/codestyle,
		src: 'demo/documentation/codestyle,
		type: 'multiple' // 'single'
	}


Research
---

**Needs**

- do we look for these?
- name of file (research.md default)

