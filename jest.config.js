module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleFileExtensions: [
		'js',
		'json',
		'vue',
		'ts',
	],
	transform: {
		'^.+\\.vue$': '@vue/vue2-jest',
		'.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
	},
	transformIgnorePatterns: [
		'/node_modules/',
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	snapshotSerializers: [
		'jest-serializer-vue',
	],
	testMatch: [
		'**/tests/unit/**/*.spec.(js|ts)|**/__tests__/*.(js|ts)',
	],
	testURL: 'http://localhost/',
	globals: {
		'ts-jest': {
			babelConfig: true,
			isolatedModules: true,
			tsconfig: false,
		},
	},
	setupFilesAfterEnv: [
		'./jest.setup.js',
		'./jest.dom.ts',
	],
	coverageReporters: ['cobertura']
};
