import Vuex, { Store, StoreOptions } from 'vuex';
import createAddress from '@src/store/address';
import { DEFAULT_FIELDS, REQUIRED_FIELDS_ADDRESS_UPDATE } from '@src/store/address/constants';

export function createStore( plugins: Array< ( s: Store<any> ) => void > = [] ) {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ 'address' ]: createAddress( REQUIRED_FIELDS_ADDRESS_UPDATE, DEFAULT_FIELDS ),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state.address.isValidating;
			},
		},
		plugins,
	};

	return new Vuex.Store<any>( storeBundle );
}
