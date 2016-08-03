/**
 * Iterates through a comments array and returns an array with a
 * 'docsTree' objects for each specified document. Each 'docsTree'
 * object represents the structure of the document in a convenient
 * form for traversing.
 */

function parsePathNames (comment) {
	const doxdownTag = comment.tags.filter(t => t.type === 'dd-doc')[0];
	return doxdownTag.string.split(/\s*>\s*/);
}

function getPage (docsTree, pageName) {
	
	if (!docsTree.subPages) {
		docsTree.subPages = [];
	}
	
	let page = docsTree.subPages.filter(p => p.pageName === pageName)[0];
	
	if (!page) {
		page = { pageName };
		docsTree.subPages.push(page);
	}
	
	return page;
}

function buildPages (docsTree, pathNames, comment) {
	
	if (pathNames.length > 0) {
		
		const page = getPage(docsTree, pathNames[0]);
		
		buildPages(page, pathNames.slice(1), comment);
		
	} else {
		
		if (!docsTree.comments) {
			docsTree.comments = [];
		}
		
		docsTree.comments.push(comment);
	}
}

function assignCommentsToDocsTrees (comments) {
	
	const docsTrees = [];
	
	comments.forEach(c => {
		
		const docsName = parsePathNames(c)[0];
		
		let docsTree = docsTrees.filter(dt => dt.docsName === docsName)[0];
		
		if (!docsTree) {
			docsTree = { docsName, comments: [] };
			docsTrees.push(docsTree);
		}
		
		docsTree.comments.push(c);
	});
	
	return docsTrees;
}

export function getDocsTrees (comments) {
	
	const docsTrees = assignCommentsToDocsTrees(comments);
	
	docsTrees.forEach(dt => {
		dt.comments.forEach(c => {
			buildPages(dt, parsePathNames(c).slice(1), c);
		});
	});
	
	return docsTrees;
}
