# React Components Integration Research #

## Documentation ##

### [React Docgen](https://github.com/reactjs/react-docgen) ###

This is a CLI and "toolbox" that can be used to extract information from react components. Mainly other styleguide generators use it to parse the proptypes from a component. It outputs an AST of the documentation surrounding the proptypes and whole component. Allows for JSDoc sytax before each proptype, and 

## Generators ##

 - [React Styleguidist](https://github.com/styleguidist/react-styleguidist)
    - seemingly extensive, and lots of docs
 - [Ecology](https://github.com/FormidableLabs/ecology)
    - components need to be created using `React.createClass()` or `class Foo extendes React.Component`
 - [React Styleguide Generator Alt](https://github.com/theogravity/react-styleguide-generator-alt)
    - allows for documentation comments as well as a static field: `styleguide`
 - [React Styleguide Generator](https://github.com/pocotan001/react-styleguide-generator)
    - the original
 - [ESDoc](https://esdoc.org/)
    - supports ES2015 styntax