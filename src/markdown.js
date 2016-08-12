/**
 * Iterates over all comment objects for a level of a 'docsTree'
 * object and pieces together a markdown string. Returns all strings
 * concatenated representing a full markdown page.
 */

const typeRgx = /\{([a-zA-Z[\]]+)\}/.source;
const nameRgx = /\s+([a-zA-Z0-9-.[\]]+)(?:\s+-)?/.source;
const descRgx = /\s+([^-].+)/.source;

// Match valid param and returns strings as output by dox
const paramRgx = new RegExp(`^${typeRgx}${nameRgx}${descRgx}$`);
const returnsRgx = new RegExp(`^${typeRgx}${descRgx}$`);

function getTagByType (tags, type) {
	return tags.filter(t => t.type === type)[0];
}

function getCommentName (comment) {
	const descTag = getTagByType(comment.tags, 'desc');
	const nameString = descTag.string.match(paramRgx)[2];
	return `### ${nameString}\n`;
}

function getCommentDescription (comment) {
	const descTag = getTagByType(comment.tags, 'desc');
	const descString = descTag.string.match(paramRgx)[3];
	return `${descString}\n<br><br>\n`;
}

function getCommentParamsHead () {
	return '#### Params\nName | Type | Description\n--- | --- | ---\n';
}

function getCommentParamsRows (comment) {
	
	const params = comment.tags.filter(t => t.type === 'param');
	
	const rows = params.map(p => {
		
		const match = p.string.match(paramRgx);
		
		// Skip if tag is badly formatted
		if (match === null) {
			return '';
		}
		
		return `${match[2]} | \`${match[1]}\` | ${match[3]}\n`;
	});
	
	return `${rows.join('')}\n`;
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
	
	return `#### Returns\n\`${match[1]}\` ${match[2]}\n<br><br>\n`;
}

function getCommentCode (comment) {
	return `#### Code\n\`\`\`javascript\n${comment.code}\n\`\`\`\n<br><br>\n`;
}

function getCommentString (comment) {
	
	let markdownString = getCommentName(comment);
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
	
	let markdownString = '';
	const funcComments = [];
	const eventComments = [];
	
	docsTree.comments.forEach(c => {
		
		const descTag = getTagByType(c.tags, 'desc');
		
		// Skip if no desc tag
		if (descTag) {
			
			const match = descTag.string.match(paramRgx);
			
			// Skip if desc tag badly formatted
			if (match) {
				
				if (match[1] === 'Function') {
					funcComments.push(c);
				}
				
				if (match[1] === 'Event') {
					eventComments.push(c);
				}
			}
		}
	});
	
	if (funcComments.length > 0) {
		
		markdownString += '## Functions\n\n';
		
		funcComments.forEach(fc =>
			markdownString += getCommentString(fc)
		);
	}
	
	if (eventComments.length > 0) {
		
		markdownString += '## Events\n\n';
		
		eventComments.forEach(ec =>
			markdownString += getCommentString(ec)
		);
	}
	
	return markdownString;
}
