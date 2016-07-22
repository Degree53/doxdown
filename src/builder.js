import assign from 'object-assign';

function findInArray (array, comparison) {
	return array.filter(i => comparison(i))[0];
}

function parsePathNames (comment) {
	const mkdoxTag = findInArray(comment.tags, t => t.type === 'mkdox');
	return mkdoxTag.string.split(/\s*>\s*/);
}

function buildPages (pathNames, docTree, comment) {
	
	if (pathNames.length === 1) {
		
		if (docTree.subPages) {
			
			const page = findInArray(docTree.subPages, p =>
				p.pageName === pathNames[0]
			);
			
			if (page) {
			
				if (page.comments) {
					page.comments.push(comment);
				} else {
					page.comments = [comment];
				}
			
			} else {
			
				docTree.subPages.push({
					pageName: pathNames[0],
					comments: [comment]
				});
			}
			
		} else {
			docTree.subPages = [{
				pageName: pathNames[0],
				comments: [comment]
			}];
		}
		
	}
	
	if (pathNames.length > 1) {
		
		if (docTree.subPages) {
			
			const page = findInArray(docTree.subPages, p =>
				p.pageName === pathNames[0]
			);
			
			if (page) {
				buildPages(pathNames.slice(1), page, comment);
			} else {
				buildPages(pathNames.slice(1), {}, comment);
			}
			
		} else {
			docTree.subPages = [
				buildPages(pathNames.slice(1), {}, comment)
			];
		}
	}
}

function getDocsFromComments (comments) {
	
	const docsTrees = [];
	
	comments.forEach(c => {
		
		const docName = parsePathNames(c)[0];
		
		let docTree = findInArray(docsTrees, dt =>
			dt.docName === docName
		);
		
		if (!docTree) {
			docTree = { docName, comments: [] };
			docsTrees.push(docTree);
		}
		
		docTree.comments.push(c);
	});
	
	return docsTrees;
}

export function getDocsTrees (comments) {
	
	const docsTrees = getDocsFromComments(comments);
	
	docsTrees.forEach(dt => {
		dt.comments.forEach(c => {
			buildPages(parsePathNames(c).slice(1), dt, c);
		});
	});
	
	return docsTrees;
}
