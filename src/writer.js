import fs from 'fs';
import mkdirp from 'mkdirp';
// import os from 'os';
import path from 'path';
import Promise from 'bluebird';
import rimraf from 'rimraf';

import * as options from './options';
import { getMarkdownString } from './markdown';

function newLine (string, indentation = 0) {
	
	let newString = string;
	
	for (let i = 0; i < indentation; i++) {
		newString = newString.replace(/(.*)/, '\t$1');
	}
	
	return `\n${newString}`;
}

function formatFilename (pageName) {
	return pageName.toLowerCase().replace(/\s+/g, '-');
}

function writeMdFile (docTree, docsPath, resolve, reject) {
	
	const pageName = docTree.pageName;
	const filename = `${formatFilename(pageName)}.md`;
	const filePath = path.join(docsPath, `${filename}`);
	const text = getMarkdownString(docTree);
	
	mkdirp(docsPath, () => {
		
		fs.writeFile(filePath, text, 'utf8', error => {
			
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

function writePages (docTree, docsPath, promises) {
	
	if (docTree.comments) {
		
		const writePromise = new Promise((resolve, reject) => {
			writeMdFile(docTree, docsPath, resolve, reject);
		});
		
		promises.push(writePromise);
		
	} else {
		// TODO: Write content if there are no comments?
	}
	
	if (docTree.subPages) {
		docTree.subPages.forEach(sp =>
			writePages(sp, docsPath, promises)
		);
	}
}

function writeMkdocs (docTree, docsPath) {
	
	const promises = [];
	
	docTree.subPages.forEach(page =>
		writePages(page, docsPath, promises)
	);
	
	return Promise.all(promises);
}

export function generateDocs (docsTrees) {
	
	const mkdoxDir = options.get('out');
	const mkdoxDirPath = path.resolve(process.cwd(), mkdoxDir);
	
	docsTrees.forEach(dt => {
		
		const docsName = dt.docName;
		const docsDirPath = path.join(mkdoxDirPath, docsName);
		const markdownDirPath = path.join(docsDirPath, './docs');
		const mkdocsYmlPath = path.join(docsDirPath, './mkdocs.yml');
		
		rimraf(path.join(mkdoxDir, docsName), {}, () => {
			
			mkdirp(markdownDirPath, () => {
				
				const stream = fs.createWriteStream(mkdocsYmlPath, 'utf8');
				stream.write(`site_name: ${docsName}`);
				stream.write(newLine('pages:'));
				
				writeMkdocs(dt, markdownDirPath, stream)
					.then(() => {
						stream.end();
						console.log(`mkdox: "${docsName}" docs output to ${docsDirPath}`);
					}, error => {
						console.log(error);
					});
			});
		});
	});
}
