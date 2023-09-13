const commonSettings = {
	preset: 'ts-jest',
	moduleFileExtensions: [
		'js',
		'json',
		'vue',
		'ts',
	],
	transform: {
		'^.+\\.vue$': '@vue/vue3-jest',
		'.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
	},
	transformIgnorePatterns: [
		'/node_modules/',
	],
	moduleNameMapper: {
		'^@src/(.*)$': '<rootDir>/src/$1',
		'^@test/(.*)$': '<rootDir>/tests/$1',
	},
	testEnvironmentOptions: {
		customExportConditions: [ 'node', 'node-addons' ],
	},
};

module.exports = {
	testEnvironmentOptions: {
		url: 'http://localhost/',
	},
	globals: {
		'ts-jest': {
			babelConfig: true,
			isolatedModules: true,
			tsconfig: false,
		},
	},
	coverageReporters: [ 'cobertura' ],
	projects: [
		{
			...commonSettings,
			displayName: 'components',
			testEnvironment: 'jsdom',
			testMatch: [
				// TODO Move the FormData initialization out of the store, so they don't rely on a browser environment
				'**/tests/unit/components/**/*.spec.(js|ts)',
			],
			snapshotSerializers: [
				'jest-serializer-vue',
			],
			setupFilesAfterEnv: [
				'./jest.setup.ts',
				'./jest.dom.ts',
			],
		},
		{
			...commonSettings,
			displayName: 'store',
			testEnvironment: 'jsdom',
			testMatch: [
				// TODO Move the FormData initialization out of the store, so they don't rely on a browser (jsdom) environment
				'**/tests/unit/store/**/*.spec.(js|ts)',
			],
			setupFilesAfterEnv: [
				'./jest.setup.ts',
				'./jest.dom.ts',
			],
		},
		{
			...commonSettings,
			displayName: 'node',
			testEnvironment: 'node',
			testMatch: [
				'**/tests/unit/*.spec.(js|ts)',
				'**/tests/unit/utils/**/*.spec.(js|ts)',
			],
			setupFilesAfterEnv: [
				'./jest.setup.ts',
			],
		},
	],
};
