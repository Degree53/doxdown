# doxdown

doxdown is a jsDoc to [MkDocs](http://www.mkdocs.org/) markdown generator. It allows you to control your documentation on a comment by comment basis, choosing the page and document the comment belongs to. This is especially useful when you need to document multiple separate APIs in one codebase.

Running it on a directory with the default options will parse all nested JavaScript files and output a `./doxdown` folder containing a folder per document each with Markdown files and a `mkdocs.yml` in the format expected by [MkDocs](http://www.mkdocs.org/).

## Installation

The easiest way to get doxdown is with NPM: `npm install doxdown`

## Usage / Options

Use the command `npm run doxdown` with the following options to generate your docs:

Name | Alias | Default | Description
--- | :---: | --- | ---
ignore | i | `.git,node_modules` | comma-separated list of files/directories to ignore
out | o | `./doxdown` | relative path to the output directory
regex | r | `\.js$` | regex string for matching files in the source directory
src | s | `./` | relative path to the source directory

## Comment Format

doxdown looks for jsDoc-style comments with a `@dd-doc` tag in the format `document[ > section] > page`, `@dd-name` and `@dd-desc` tags and `@dd-param` tags in the same format as a jsDoc `@param`.

```javascript
/**
 * @dd-doc My API > My Section > My Page
 * @dd-name myFunction
 * @dd-desc A description of myFunction
 * @dd-param {string} myParam a description of myParam
 * @dd-param {string} my2ndParam a description of my2ndParam
 */
 
function myFunction (myParam, my2ndParam) {
	// ...
}
```
