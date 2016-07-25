const typeRgx = /(\{[a-zA-Z]+\})/.source;
const nameRgx = /([a-zA-Z0-9.?]+)/.source;
const descRgx = /([a-zA-Z0-9'\s]+)/.source;

// Matches a valid param string as output by dox
const paramRgx = new RegExp(`^${typeRgx}\\s+${nameRgx}\\s+[-\\s]*${descRgx}$`);

function getTagValue (tags, type) {
	return tags.filter(tag => tag.type === type)[0];
}

function getCommentName (comment) {
	const commentName = getTagValue(comment.tags, 'name');
	return `\n## ${commentName.string}\n`;
}

function getCommentDescription (comment) {
	const commentDesc = getTagValue(comment.tags, 'desc');
	return `${commentDesc.string}\n`;
}

function getCommentTableHead () {
	return '\nName | Type | Description\n- | - | -\n';
}

function getCommentTableRows (comment) {
	
	const params = comment.tags.filter(tag => tag.type === 'param');
	
	return params.map(param => {
		
		if (!paramRgx.test(param.string)) {
			// Skip if param badly formatted
			return '';
		}
		
		const commentType = param.string.match(paramRgx)[1];
		const commentName = param.string.match(paramRgx)[2];
		const commentDesc = param.string.match(paramRgx)[3];
		
		return `${commentName} | ${commentType} | ${commentDesc}\n`;
		
	}).join('');
}

function getCommentCode (comment) {
	return `\n\`\`\`javascript\n${comment.code}\n\`\`\`\n`;
}

export function getMarkdownString (tree) {
	
	let markdownString = `# ${tree.pageName}\n`;
	
	tree.comments.forEach(comment => {
		
		markdownString += getCommentName(comment);
		markdownString += getCommentDescription(comment);
		markdownString += getCommentTableHead();
		markdownString += getCommentTableRows(comment);
		markdownString += getCommentCode(comment);
	});
	
	return markdownString;
}
