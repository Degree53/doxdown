function parsePathNames (comment) {
	const doxdownTag = comment.tags.find(t => t.type === 'dd');
	return doxdownTag.string.split(/\s*>\s*/);
}

function addPage (subPages, pageName, comment) {
	
	const page = subPages.find(p => p.pageName === pageName);
	
	if (page) {
		
		if (page.comments) {
			page.comments.push(comment);
		} else {
			page.comments = [comment];
		}
		
	} else {
		
		subPages.push({
			pageName,
			comments: [comment]
		});
	}
}

function buildPages (pathNames, docTree, comment) {
	
	if (pathNames.length === 1) {
		
		if (docTree.subPages) {
			addPage(docTree.subPages, pathNames[0], comment);
		} else {
			docTree.subPages = [];
			addPage(docTree.subPages, pathNames[0], comment);
		}
	}
	
	if (pathNames.length > 1) {
		
		if (docTree.subPages) {
			
			const page = docTree.subPages.find(p =>
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
		
		let docTree = docsTrees.find(dt => dt.docName === docName);
		
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
