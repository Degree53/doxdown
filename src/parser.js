/**
 * Traverses the source directory tree and collects an array of file
 * paths for parsing. Then uses Dox to parse all the valid files and
 * returns an array of doxdown comment objects.
 */

import dox from 'dox';
import fs from 'fs';
import path from 'path';

import * as options from './options';

function getFilePaths (dir, filePaths = []) {

	// Remove ignored files / directories
	const fileOrDirNames = fs.readdirSync(dir)
		.filter(fdn => !(options.get('ignore').indexOf(fdn) + 1));
	
	fileOrDirNames.forEach(fn => {
		
		const filePath = path.resolve(process.cwd(), dir, fn);
		
		// Add file path to array if valid
		if (options.get('regex').test(filePath)) {
			filePaths.push(filePath);
		}
		
		// Call recursively to traverse directory tree
		if (fs.statSync(filePath).isDirectory()) {
			getFilePaths(path.join(dir, fn), filePaths);
		}
	});
	
	return filePaths;
}

export function getDoxdownComments () {
	
	const comments = [];
	const filePaths = getFilePaths(options.get('src'));
	
	// Read each file and parse it with Dox
	filePaths.forEach(fp => {
		const text = fs.readFileSync(fp, 'utf8');
		dox.parseComments(text).forEach(c => comments.push(c));
	});
	
	// Only return comments with docs tags
	return comments.filter(c =>
		c.tags.filter(t => t.type === 'docs')[0]
	);
}
