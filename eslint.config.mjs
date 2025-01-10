import typescriptEslint from '@typescript-eslint/eslint-plugin';
import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import parser from 'vue-eslint-parser';
import commonStyle from './src/fun-coding-style/common.mjs';

export default [
	commonStyle,
	{
		files: [ '**/*.vue', '**/*.ts', '**/*.js', '*.mjs' ],
		plugins: {
			'@typescript-eslint': typescriptEslint,
		},

		languageOptions: {
			globals: {
				...globals.node,
			},

			parser: parser,
			ecmaVersion: 7,
			sourceType: 'module',

			parserOptions: {
				parser: '@typescript-eslint/parser',

				ecmaFeatures: {
					modules: true,
				},
			},
		},

		rules: {
			// TODO ask team if we should enable this, otherwise the typescript plugin is only used for parsing
			// ...typescriptEslint.configs.recommended.rules,
			// "@typescript-eslint/no-explicit-any": "off",
			// "@typescript-eslint/no-wrapper-object-types": "off",
			// "@typescript-eslint/ban-ts-comment": "off",

			'no-console': 'error',
			'no-debugger': 'error',

			// problematic in TypeScript / ES6
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [ 'error', {
				args: 'after-used',
				argsIgnorePattern: '^_',
				caughtErrors: 'none',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true,
			} ],

			'one-var': 'off',
			'no-undef': 'off',
		},
	},
	{
		files: [ '**/*.vue' ],
		plugins: {
			vue: pluginVue,
			'vuejs-accessibility': vuejsAccessibility,

		},
		languageOptions: {
			parser: parser,
			parserOptions: {
				parser: '@typescript-eslint/parser',
				ecmaVersion: 2020,
				sourceType: 'module',
			},
		},
		rules: {
			...pluginVue.configs.recommended.base,
			...vuejsAccessibility.configs.recommended.rules,
			// Turn max len off to allow for long SVG components
			'max-len': 'off',

			'vue/no-unused-components': [ 'error', {
				ignoreWhenBindingPresent: false,
			} ],
			'vuejs-accessibility/label-has-for': [ 'error', {
				required: {
					some: [ 'nesting', 'id' ],
				},
			} ],

			// We use autofocus to ensure the first form field in dialog modals is focused on open
			'vuejs-accessibility/no-autofocus': 'off',
		},
	},
];
