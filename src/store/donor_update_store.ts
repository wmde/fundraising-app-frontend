import Vuex, { StoreOptions } from 'vuex';
import createAddress from '@src/store/address';
import { DEFAULT_FIELDS, REQUIRED_FIELDS_DONOR_UPDATE } from '@src/store/address/constants';

export function createStore() {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ 'address' ]: createAddress( REQUIRED_FIELDS_DONOR_UPDATE, DEFAULT_FIELDS ),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state.address.isValidating;
			},
		},
	};

	return new Vuex.Store<any>( storeBundle );
}
