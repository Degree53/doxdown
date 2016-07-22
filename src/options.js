const options = {
	ignore: {
		alias: 'i',
		parser: value => value.split(','),
		value: ['.git', 'node_modules']
	},
	out: {
		alias: 'o',
		parser: value => value,
		value: './mkdox'
	},
	regex: {
		alias: 'r',
		parser: value => new RegExp(value),
		value: new RegExp(/\.js$/)
	},
	src: {
		alias: 's',
		parser: value => value,
		value: './'
	}
};

function getOptionByAlias (alias) {
	
	let option;
	
	Object.keys(options).forEach(key => {
		if (options[key].alias === alias) {
			option = options[key];
		}
	});
	
	return option;
}

export function get (optionName) {
	return options[optionName].value;
}

export function set (optionName, value) {
	
	const option = optionName.length === 1 ?
		getOptionByAlias(optionName) : options[optionName];
	
	if (!option) {
		throw new Error(`${optionName} is not a supported option`);
	}
	
	option.value = option.parser(value);
}
