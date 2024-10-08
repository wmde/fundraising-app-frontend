module.exports = {
	root: true,

	env: {
		node: true,
		es6: true,
	},

	plugins: [
		'@typescript-eslint',
		'eslint-plugin-vuejs-accessibility',
	],

	extends: [
		'wikimedia',
		'plugin:vue/base',
		'plugin:vuejs-accessibility/recommended',
	],

	rules: {
		'no-console': 'error',
		'no-debugger': 'error',

		// problematic in TypeScript / ES6
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': [ 'error', {
			'args': 'after-used',
			'argsIgnorePattern': '^_',
			'caughtErrors': 'none',
			'caughtErrorsIgnorePattern': '^_',
			'destructuredArrayIgnorePattern': '^_',
			'varsIgnorePattern': '^_',
			'ignoreRestSiblings': true,
		} ],
		'one-var': 'off',
		'no-undef': 'off',
		// See https://stackoverflow.com/a/65768375/130121
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': [ 'error' ],

		// diverging from Wikimedia rule set
		'max-len': [ 'error', 170 ],
		'comma-dangle': [ 'error', 'always-multiline' ],
		'operator-linebreak': 'off',
		'quote-props': 'off',
		// Typescript helps with documentation, don't require params and retuns
		'valid-jsdoc': 'off',
		'jsdoc/require-param': 'off',
		'jsdoc/require-returns': 'off',
		'jsdoc/require-param-type': 'off',

		// Allow template literals
		'quotes': [ 'error', 'single', { allowTemplateLiterals: true } ],

		'vue/no-unused-components': [ 'error', { 'ignoreWhenBindingPresent': false } ],
		'vuejs-accessibility/label-has-for': [ 'error', {
			'required': {
				'some': [ 'nesting', 'id' ],
			},
		} ],

		// We use autofocus to ensure the first form field in dialog modals is focused on open
		'vuejs-accessibility/no-autofocus': 'off',
	},

	parser: 'vue-eslint-parser',

	parserOptions: {
		'parser': '@typescript-eslint/parser',
		'sourceType': 'module',
		'ecmaVersion': 7,
		'ecmaFeatures': {
			'modules': true,
		},
	},
};
