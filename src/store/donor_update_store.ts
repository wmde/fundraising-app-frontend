import Vuex, { StoreOptions } from 'vuex';
import createAddress from '@src/store/address';
import { NS_ADDRESS } from './namespaces';
import { REQUIRED_FIELDS_DONOR_UPDATE } from '@src/store/address/constants';

export function createStore() {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ NS_ADDRESS ]: createAddress( REQUIRED_FIELDS_DONOR_UPDATE ),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state[ NS_ADDRESS ].isValidating;
			},
		},
	};

	return new Vuex.Store<any>( storeBundle );
}
