import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
// See https://stackoverflow.com/a/57439821/130121
require( 'regenerator-runtime/runtime' );

// eslint-disable-next-line no-underscore-dangle
global._paq = {
	push: jest.fn(),
};

config.global.plugins = [ createI18n( { legacy: false, missingWarn: false, fallbackWarn: false } ) ];
config.global.mocks = {
	t: ( key: string ) => key,
	n: ( key: string ) => key,
};
