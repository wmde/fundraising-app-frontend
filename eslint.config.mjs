import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import parser from 'vue-eslint-parser';
import commonStyle from './src/fun-coding-style/common.mjs';
import typescriptStyle from './src/fun-coding-style/typescript.mjs';

// A workaround until our project really uses the fixed "globals" package (eslint transitive dependency)
// See https://github.com/sindresorhus/globals/issues/239
const fixedBrowserGlobals = Object.assign( {}, globals.browser, { AudioWorkletGlobalScope: globals.browser[ 'AudioWorkletGlobalScope ' ] } );
delete fixedBrowserGlobals[ 'AudioWorkletGlobalScope ' ];

export default [
	commonStyle,
	{
		files: [ '**/*.vue', '**/*.ts' ],
		plugins: {
			...typescriptStyle.plugins,
		},
		languageOptions: {
			globals: {
				...globals.node,
				...fixedBrowserGlobals,
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
			...typescriptStyle.rules,

			// The following rules should be turned on again in the future (using the settings from typescriptStyle)
			// We placed them here to avoid huge changes in our legacy codebase and to allow for slow migration
			// See https://phabricator.wikimedia.org/T383409
			'@typescript-eslint/array-type': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-wrapper-object-types': 'off',

			// Custom rules to prevent shipping debug code to prod
			'no-console': 'error',
			'no-debugger': 'error',
		},
	},
	{
		name: 'Additional rules for Jest TypeScript test files',
		files: [ 'tests/**/*.ts' ],
		languageOptions: {
			globals: {
				...globals.node,
				...fixedBrowserGlobals,
				...globals.jest,
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
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-namespace': 'off',
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
			...pluginVue.configs.essential.rules,
			...vuejsAccessibility.configs.recommended.rules,

			// The following rules should be turned on again in the future (using the settings from pluginVue.configs.essential)
			// We placed them here to avoid huge changes in our legacy codebase and to allow for slow migration
			// See https://phabricator.wikimedia.org/T383420
			'vue/multi-word-component-names': 'off',
			'vue/no-mutating-props': 'off',
			'vue/no-multiple-template-root': 'off',
			'vue/no-v-for-template-key': 'off',

			// Allow for dot-separated slot names for our custom FeatureToggle component
			// We should consider renaming the slots to use a different separator
			'vue/valid-v-slot': 'off',

			// Allow for long SVG components by having a ridiculous max-len for the template section of Vue files
			'@stylistic/max-len': 'off',
			'vue/max-len': [ 'warn', {
				code: 170,
				template: 100_000,
				tabWidth: 4,
				ignorePattern: '^[\\s]*(//|<!--) (es|style)lint-.+',
				ignoreUrls: true,
				ignoreComments: false,
				ignoreRegExpLiterals: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
			} ],

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
