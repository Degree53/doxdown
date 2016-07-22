const paramRegex = /^\{[A-Za-z]+\}\s+[A-Za-z]+\s+[A-Za-z\s]+$/;
const descRegex = /^\{[A-Za-z]+\}\s+[A-Za-z]+\s+([A-Za-z\s]+)$/;
const nameRegex = /^\{[A-Za-z]+\}\s+([A-Za-z]+)\s+[A-Za-z\s]+$/;
const typeRegex = /^(\{[A-Za-z]+\})\s+[A-Za-z]+\s+[A-Za-z\s]+$/;

function getTagValue (tags, type) {
	return tags.filter(tag => tag.type === type)[0];
}

function getCommentName (comment) {
	const name = getTagValue(comment.tags, 'name');
	return `\n## ${name.string}\n`;
}

function getCommentDescription (comment) {
	const desc = getTagValue(comment.tags, 'desc');
	return `${desc.string}\n`;
}

function getCommentTableHead () {
	return '\nName | Type | Description\n- | - | -\n';
}

function getCommentTableRows (comment) {
	
	const params = comment.tags.filter(tag => tag.type === 'param');
	
	return params.map(param => {
		
		if (!paramRegex.test(param.string)) {
			return '';
		}
		
		const name = param.string.match(nameRegex)[1];
		const type = param.string.match(typeRegex)[1];
		const desc = param.string.match(descRegex)[1];
		
		return `${name} | ${type} | ${desc}\n`;
		
	}).join('');
}

function getCommentCode (comment) {
	return `\n\`\`\`javascript\n${comment.code}\n\`\`\`\n`;
}

export function toMarkdownString (tree) {
	
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
