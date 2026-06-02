import Vuex, { StoreOptions } from 'vuex';
import createAddress from '@src/store/membership_address';
import { DEFAULT_FIELDS, REQUIRED_FIELDS_MEMBERSHIP_APPLICANT_UPDATE } from '@src/store/membership_address/constants';

export function createStore() {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ 'membership_address' ]: createAddress( REQUIRED_FIELDS_MEMBERSHIP_APPLICANT_UPDATE, DEFAULT_FIELDS ),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state.membership_address.isValidating;
			},
		},
	};

	return new Vuex.Store<any>( storeBundle );
}
