import security from 'eslint-plugin-security';
import unicorn from 'eslint-plugin-unicorn';
import js from '@eslint/js';
import formatting from './formatting.mjs';

export default {
	name: 'WMDE FUN Common Coding Style',

	plugins: {
		...formatting.plugins,
		security: security,
		unicorn: unicorn,
	},
	rules: {
		...formatting.rules,
		...js.configs.recommended.rules,
		...security.configs.recommended.rules,

		'array-callback-return': 'error',
		'block-scoped-var': 'error',
		camelcase: [ 'error', { properties: 'always' } ],
		curly: [ 'error', 'all' ],
		'dot-notation': [ 'error' ],
		eqeqeq: 'error',
		'key-spacing': [ 'error', { beforeColon: false, afterColon: true } ],
		'new-cap': [ 'error', { newIsCap: true, capIsNew: false, properties: true } ],
		'no-array-constructor': 'error',
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-constant-binary-expression': 'error',
		'no-constant-condition': [ 'error', { checkLoops: false } ],
		'no-empty': [ 'error', { allowEmptyCatch: true } ],
		'no-eval': 'error',
		'no-extend-native': 'error',
		'no-extra-bind': 'error',
		'no-extra-label': 'error',
		'no-implicit-coercion': [ 'error', { string: true, boolean: false, number: false } ],
		'no-implicit-globals': 'error',
		'no-label-var': 'error',
		'no-loop-func': 'error',
		'no-loss-of-precision': 'error',
		'no-multi-spaces': 'error',
		'no-multiple-empty-lines': [ 'error', { max: 1, maxBOF: 0, maxEOF: 0 } ],
		'no-new': 'error',
		'no-new-func': 'error',
		'no-new-object': 'error',
		'no-new-wrappers': 'error',
		'no-nonoctal-decimal-escape': 'error',
		'no-octal-escape': 'error',
		'no-proto': 'error',
		'no-prototype-builtins': 'error',
		'no-return-assign': 'error',
		'no-script-url': 'error',
		'no-self-compare': 'error',
		'no-sequences': 'error',
		'no-shadow': [ 'error', { hoist: 'all' } ],
		'no-shadow-restricted-names': 'error',
		'no-throw-literal': 'error',
		'no-undef-init': 'error',
		'no-underscore-dangle': 'error',
		'no-unmodified-loop-condition': 'error',
		'no-unneeded-ternary': [ 'error', { defaultAssignment: false } ],
		'no-unreachable-loop': 'error',
		'no-unused-expressions': 'error',
		'no-use-before-define': [ 'error', 'nofunc' ],
		'no-useless-call': 'error',
		'no-useless-concat': 'error',
		'no-void': 'error',
		'no-with': 'error',
		'prefer-numeric-literals': 'error',
		'prefer-regex-literals': 'error',
		'unicode-bom': [ 'error' ],
		yoda: [ 'error', 'never' ],

		'security/detect-object-injection': 'off',
		'unicorn/prefer-date-now': 'error',
		'unicorn/prefer-string-slice': 'error',
		'unicorn/throw-new-error': 'error',
	},

};