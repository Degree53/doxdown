/**
 * Iterates over all comment objects for a level of a 'docsTree'
 * object and pieces together a markdown string. Returns all strings
 * concatenated representing a full markdown page.
 */

const typeRgx = /(\{[a-zA-Z]+\})/.source;
const nameRgx = /\s+([a-zA-Z0-9.]+)/.source;
const descRgx = /\s+(?:-\s+)?(.+)/.source;

// Matches a valid param string as output by dox
const paramRgx = new RegExp(`^${typeRgx}${nameRgx}${descRgx}$`);

function getTagByType (tags, type) {
	return tags.filter(t => t.type === type)[0];
}

function getCommentName (comment) {
	const nameTag = getTagByType(comment.tags, 'dd-name');
	return nameTag ? `\n## ${nameTag.string}\n` : '\n## Missing Name!\n';
}

function getCommentDescription (comment) {
	const descTag = getTagByType(comment.tags, 'dd-desc');
	return descTag ? `${descTag.string}\n` : 'Missing Description!\n';
}

function getCommentTableHead () {
	return '\nName | Type | Description\n--- | --- | ---\n';
}

function getCommentTableRows (comment) {
	
	const params = comment.tags.filter(t => t.type === 'dd-param');
	
	return params.map(p => {
		
		const match = p.string.match(paramRgx);
		
		// Skip if param is badly formatted
		if (match === null) {
			return '';
		}
		
		return `${match[2]} | ${match[1]} | ${match[3]}\n`;
		
	}).join('');
}

function getCommentCode (comment) {
	return `\n\`\`\`javascript\n${comment.code}\n\`\`\`\n`;
}

export function getMarkdownString (docsTree) {
	
	let markdownString = `# ${docsTree.pageName}\n`;
	
	docsTree.comments.forEach(c => {
		
		markdownString += getCommentName(c);
		markdownString += getCommentDescription(c);
		
		const tableRows = getCommentTableRows(c);
		
		if (tableRows.length > 0) {
			markdownString += getCommentTableHead();
			markdownString += tableRows;
		}
		
		markdownString += getCommentCode(c);
	});
	
	return markdownString;
}
