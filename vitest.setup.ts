import { vi } from 'vitest';
import { config } from "@vue/test-utils";
import { createI18n } from 'vue-i18n';

// eslint-disable-next-line no-underscore-dangle
globalThis._paq = {
	push: vi.fn(),
};

config.global.plugins = [ createI18n( { legacy: false, missingWarn: false, fallbackWarn: false } ) ];

vi.mock( 'vue-i18n', async () => {
	const vuei18n = await vi.importActual( 'vue-i18n' );
	return {
		...vuei18n,
		useI18n: vi.fn().mockReturnValue( {
			t: ( key: string, params?: Object ) => JSON.stringify( { key, ...params } ),
			n: ( amount: string, keyOrOptions?: string | object ) => {
				if ( typeof keyOrOptions === 'string' ) {
					return `${amount}-${keyOrOptions}`;
				}

				return JSON.stringify( { amount, ...keyOrOptions } );
			},
		} ),
	};
} );
