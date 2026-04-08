import { configDefaults, defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig( {
	plugins: [ Vue() ],

	test: {
		globals: false,
		projects: [
			// The `just-the-defaults` directory is a "project" that does not exist.
			// We only use it to define the shared defaults (coverage and resolve aliases) for the others
			// See https://vitest.dev/guide/projects
			'just-the-defaults/*',
			{
				extends: true,
				test: {
					include: [ 'tests/unit/components/**/*.spec.ts' ],
					name: 'unit',
					environment: 'jsdom',
					setupFiles: 'vitest.setup.ts',
				},
			},
			{
				extends: true,
				test: {
					include: [ 'tests/unit/store/**/*.spec.ts' ],
					name: 'store',
					environment: 'jsdom',
				},
			},
			{
				extends: true,
				test: {
					include: [ 'tests/unit/*.spec.(js|ts)', 'tests/unit/utils/**/*.spec.(js|ts)' ],
					name: 'banners',
					environment: 'node',
				},
			},
		],
		coverage: {
			exclude: [
				...configDefaults.coverage.exclude,

				'dist/*',
				'eslint.config.mjs',
				'webpack/*',
				'webpack.config.js',
			],
		},
	},
	resolve: {
		alias: {
			'@src': fileURLToPath( new URL( './src', import.meta.url ) ),
			'@test': fileURLToPath( new URL( './tests', import.meta.url ) ),
		},
	},
} );
