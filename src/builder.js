function parsePathNames (comment) {
	const doxdownTag = comment.tags.find(t => t.type === 'dd');
	return doxdownTag.string.split(/\s*>\s*/);
}

function buildPages (docsTree, pathNames, comment) {
	
	if (pathNames.length > 0) {
		
		if (!docsTree.subPages) {
			docsTree.subPages = [];
		}
		
		let page = docsTree.subPages.find(p =>
			p.pageName === pathNames[0]
		);
		
		if (!page) {
			page = { pageName: pathNames[0] };
			docsTree.subPages.push(page);
		}
		
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
		
		let docsTree = docsTrees.find(dt => dt.docsName === docsName);
		
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
