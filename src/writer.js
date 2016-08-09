/**
 * Traverses each 'docsTree' object and writing markdown pages for
 * each level with comments as well as writing titles and filenames
 * to a mkdocs.yml file.
 */

import clic from 'cli-color';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import Promise from 'bluebird';
import rimraf from 'rimraf';

import * as options from './options';
import { getMarkdownString } from './markdown';

function newLine (string, indent = 0) {
	
	let newString = string;
	
	for (let i = 0; i < indent; i++) {
		newString = `    ${newString}`;
	}
	
	return `\n${newString}`;
}

function formatFilename (pageName) {
	return pageName.toLowerCase().replace(/\s+/g, '-');
}

function getTimeString () {
	return new Date().toTimeString().substring(0, 8);
}

function writeMdFile (text, filePath, resolve, reject) {
	
	fs.writeFile(filePath, text, 'utf8', error => {
		
		if (error) {
			reject(error);
		} else {
			console.log(`[${getTimeString()}] ${filePath}`);
			resolve(filePath);
		}
	});
}

function writePages (docsTree, writePath, promises, stream, indent = 0) {
	
	stream.write(newLine(`- '${docsTree.pageName}':`, indent));
	
	if (docsTree.subPages) {
		
		const dirName = formatFilename(docsTree.pageName);
		const subDirPath = path.join(writePath, dirName);
		
		docsTree.subPages.forEach(sp =>
			writePages(sp, subDirPath, promises, stream, indent + 1)
		);
		
	} else {
		
		const fileName = `${formatFilename(docsTree.pageName)}.md`;
		const filePath = path.join(writePath, fileName);
		
		const writePromise = new Promise((resolve, reject) => {
			
			const text = getMarkdownString(docsTree);
			
			mkdirp(writePath, () => {
				writeMdFile(text, filePath, resolve, reject);
			});
		});
		
		promises.push(writePromise);
		
		let relWritePath = writePath.replace(/^.*docs[/\\]?(.*)$/, '$1');
		relWritePath = path.join(relWritePath, fileName).replace(/\\/g, '/');
		stream.write(` '${relWritePath}'`);
	}
}

function writeMkdocs (docsTree, markdownPath, stream) {
	
	const indexPath = path.join(markdownPath, 'index.md');
	const indexPromise = new Promise((resolve, reject) => {
		writeMdFile(`# ${docsTree.docsName}`, indexPath, resolve, reject);
	});
	stream.write(newLine('- Home: \'index.md\''));
	
	const promises = [indexPromise];
	
	docsTree.subPages.forEach(sp =>
		writePages(sp, markdownPath, promises, stream)
	);
	
	return Promise.all(promises);
}

export function generateDocs (docsTrees) {
	
	const outputDir = options.get('out');
	const outputPath = path.resolve(process.cwd(), outputDir);
	
	docsTrees.forEach(dt => {
		
		const docsName = dt.docsName;
		const docsPath = path.join(outputPath, docsName);
		const markdownPath = path.join(docsPath, './docs');
		const mkdocsYmlPath = path.join(docsPath, './mkdocs.yml');
		const success = clic.green(`"${docsName}" docs write complete`);
		const fail = clic.red(`"${docsName}" docs write failed`);
		
		rimraf(path.join(outputDir, docsName), {}, () => {
			
			mkdirp(markdownPath, () => {
				
				const stream = fs.createWriteStream(mkdocsYmlPath, 'utf8');
				stream.write(`site_name: ${docsName}`);
				stream.write(newLine('pages:'));
				
				writeMkdocs(dt, markdownPath, stream)
					.then(filePaths => {
						stream.end();
						console.log(`[${getTimeString()}] ${success}`);
					}, error => {
						stream.end();
						console.log(`[${getTimeString()}] ${fail}`);
					});
			});
		});
	});
}
