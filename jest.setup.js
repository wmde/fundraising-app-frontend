// See https://stackoverflow.com/a/57439821/130121
require( 'regenerator-runtime/runtime' );

// eslint-disable-next-line no-underscore-dangle
global._paq = {
	push: jest.fn(),
};
