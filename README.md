# doxdown

***doxdown*** is a jsDoc to [MkDocs](http://www.mkdocs.org/) markdown generator. It allows you to control your documentation on a comment by comment basis, choosing the page and document the comment belongs to. This is especially useful when you need to document an API separate to the rest of your codebase.

Running it on a directory with the default options will parse all nested JavaScript files and output a `./doxdown` folder. Inside will be a folder for each document with Markdown files and a `mkdocs.yml` file in the format expected by [MkDocs](http://www.mkdocs.org/). You can then run [MkDocs](http://www.mkdocs.org/) on any of those folders to build a site that you can deploy to a server.

## Installation

The easiest way to get ***doxdown*** is with NPM: `npm install doxdown --global`

## Usage / Options

Use the command `doxdown` with the following options to generate your docs:

Name | Alias | Default | Description
--- | :---: | --- | ---
ignore | i | `.git,node_modules` | comma-separated list of files/directories to ignore
out | o | `./doxdown` | relative path to the output directory
regex | r | `\.js$` | regex string for matching files in the source directory
src | s | `./` | relative path to the source directory

## Comment Format

***doxdown*** looks for jsDoc-style comments with a special `@docs` tag in the format `document [// section] // page` which describes where the comment belongs in which document. Use a jsDoc `@func` or `@event` tag followed by a name along with a `@desc` tag to describe the function or event. You can have any number of jsDoc style `@param` tags and one `@returns` tag.

```javascript
/**
 * @docs Some Docs // Users & Accounts // User Helpers
 * @func getUsernames
 * @desc A description of getUsernames
 * @param {Object[]} users - An array of user objects
 * @param {String} users[].name - A user's name
 * @param {Number} limit - The max number to return
 * @returns {String[]} An array of usernames
 */

function getUsernames (users, limit) {
	
	const usernames = [];
	
	for (let i = 0; i < limit; i++) {
		usernames.push(users[i].name);
	}
	
	return usernames;
}

/**
 * @docs Tracking // Registration
 * @event registration-complete
 * @desc Fires when a user successfully completes registration.
 * @param {String} forename - The user's forename
 * @param {String} surname - The user's surname
 * @param {Date} dob - The user's date of birth
 * @param {Object} address - An object containing details of a user's address
 * @param {String} address.house - The house name/no. of the user's address
 * @param {String} address.postcode - The postcode of the user's address
 */

SomeTrackingAPI.trigger('registration-complete', {
	forename: "Sherlock",
	surname: "Holmes"
	dob: dateOfBirth,
	address: {
		house: "221B",
		postcode: "NW16XE"
	}
});

```

## TODO
- Replace `regex` option with glob pattern for matching files and directories.
