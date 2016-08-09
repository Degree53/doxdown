/**
 * Iterates over all comment objects for a level of a 'docsTree'
 * object and pieces together a markdown string. Returns all strings
 * concatenated representing a full markdown page.
 */

const typeRgx = /\{([a-zA-Z[\]]+)\}/.source;
const nameRgx = /\s+([a-zA-Z0-9.[\]]+)(?:\s+-)?/.source;
const descRgx = /\s+([^-].+)/.source;

// Match valid param and returns strings as output by dox
const paramRgx = new RegExp(`^${typeRgx}${nameRgx}${descRgx}$`);
const returnsRgx = new RegExp(`^${typeRgx}${descRgx}$`);

function getTagByType (tags, type) {
	return tags.filter(t => t.type === type)[0];
}

function getCommentName (comment, type) {
	const nameTag = getTagByType(comment.tags, type);
	const nameString = nameTag ? nameTag.string : 'Missing Name!';
	return `\n### ${nameString}\n`;
}

function getCommentDescription (comment) {
	const descTag = getTagByType(comment.tags, 'desc');
	const descString = descTag ? descTag.string : 'Missing Description!';
	return `${descString}\n`;
}

function getCommentParamsHead () {
	return '\n#### Params\nName | Type | Description\n--- | --- | ---\n';
}

function getCommentParamsRows (comment) {
	
	const params = comment.tags.filter(t => t.type === 'param');
	
	return params.map(p => {
		
		const match = p.string.match(paramRgx);
		
		// Skip if tag is badly formatted
		if (match === null) {
			return '';
		}
		
		return `${match[2]} | \`${match[1]}\` | ${match[3]}\n`;
		
	}).join('');
}

function getCommentReturns (comment) {
	
	const returnsTag = getTagByType(comment.tags, 'returns');
	
	// Skip if no returns tag
	if (!returnsTag) {
		return '';
	}
	
	const match = returnsTag.string.match(returnsRgx);
	
	// Skip if tag is badly formatted
	if (match === null) {
		return '';
	}
	
	return `\n#### Returns\n\`${match[1]}\` ${match[2]}\n`;
}

function getCommentCode (comment) {
	return `\n#### Code\n\`\`\`javascript\n${comment.code}\n\`\`\`\n`;
}

function getCommentString (comment, type) {
	
	let markdownString = getCommentName(comment, type);
	markdownString += getCommentDescription(comment);
	
	const tableRows = getCommentParamsRows(comment);
	
	if (tableRows.length > 0) {
		markdownString += getCommentParamsHead();
		markdownString += tableRows;
	}
	
	markdownString += getCommentReturns(comment);
	return markdownString += getCommentCode(comment);
}

export function getMarkdownString (docsTree) {
	
	let markdownString = `# ${docsTree.pageName}\n`;
	
	const funcComments = docsTree.comments.filter(c =>
		getTagByType(c.tags, 'func')
	);
	
	if (funcComments.length > 0) {
		markdownString += '\n## Functions\n';
	}
	
	funcComments.forEach(fc =>
		markdownString += getCommentString(fc, 'func')
	);
	
	const eventComments = docsTree.comments.filter(c =>
		getTagByType(c.tags, 'event')
	);
	
	if (eventComments.length > 0) {
		markdownString += '\n## Events\n';
	}
	
	eventComments.forEach(ec =>
		markdownString += getCommentString(ec, 'event')
	);
	
	return markdownString;
}
