import typescriptEslint from "@typescript-eslint/eslint-plugin";
import vuejsAccessibility from "eslint-plugin-vuejs-accessibility";
import globals from "globals";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	...compat.extends("wikimedia", "plugin:vue/base", "plugin:vuejs-accessibility/recommended"),
	{
		plugins: {
			"@typescript-eslint": typescriptEslint,
			"vuejs-accessibility": vuejsAccessibility,
		},

		languageOptions: {
			globals: {
				...globals.node,
			},

			parser: parser,
			ecmaVersion: 7,
			sourceType: "module",

			parserOptions: {
				parser: "@typescript-eslint/parser",

				ecmaFeatures: {
					modules: true,
				},
			},
		},

		rules: {
			"no-console": "error",
			"no-debugger": "error",
			"no-unused-vars": "off",

			"@typescript-eslint/no-unused-vars": ["error", {
				args: "after-used",
				argsIgnorePattern: "^_",
				caughtErrors: "none",
				caughtErrorsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				ignoreRestSiblings: true,
			}],

			"one-var": "off",
			"no-undef": "off",
			"no-shadow": "off",
			"@typescript-eslint/no-shadow": ["error"],
			"max-len": ["error", 170],
			"comma-dangle": ["error", "always-multiline"],
			"operator-linebreak": "off",
			"quote-props": "off",
			"jsdoc/require-param": "off",
			"jsdoc/require-returns": "off",
			"jsdoc/require-param-type": "off",

			quotes: ["error", "single", {
				allowTemplateLiterals: true,
			}],

			"vue/no-unused-components": ["error", {
				ignoreWhenBindingPresent: false,
			}],

			"vuejs-accessibility/label-has-for": ["error", {
				required: {
					some: ["nesting", "id"],
				},
			}],

			"vuejs-accessibility/no-autofocus": "off",
		},
	},
];
