module.exports = {
	moduleFileExtensions: [
		'js',
		'json',
		'vue',
		'ts',
	],
	transform: {
		'^.+\\.vue$': 'vue-jest',
		'.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
		'^.+\\.tsx?$': 'ts-jest',
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
		},
	},
	setupFilesAfterEnv: [
		'./jest.setup.js',
		'./jest.dom.ts',
	],
};
