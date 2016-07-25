import dox from 'dox';
import fs from 'fs';
import path from 'path';

import * as options from './options';

export function getFilePaths (dir, filePaths = []) {

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

export function getDoxdownComments (filePaths) {
	
	const comments = [];
	
	// Read each file and parse it with Dox
	filePaths.forEach(fp => {
		const text = fs.readFileSync(fp, 'utf8');
		dox.parseComments(text).forEach(c => comments.push(c));
	});
	
	// Only return comments with dd tags
	return comments.filter(c =>
		c.tags.find(t => t.type === 'dd')
	);
}
