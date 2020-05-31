module.exports = {
	extends: 'standard',
	'rules': {
		'eol-last': ['error', 'never'],
		'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
		'space-before-function-paren': ['error', 'never'],
		'no-unused-vars': 'off',
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
		'indent': ['error', 'tab'],
		'no-tabs': 0
	}
}

