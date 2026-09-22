import Vuex, { StoreOptions } from 'vuex';
import createAddress from '@src/store/membership_address';
import createPayment from '@src/store/membership_fee';
import { DEFAULT_FIELDS, REQUIRED_FIELDS_MEMBERSHIP_APPLICANT_UPDATE } from '@src/store/membership_address/constants';

export function createStore() {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ 'address' ]: createAddress( REQUIRED_FIELDS_MEMBERSHIP_APPLICANT_UPDATE, DEFAULT_FIELDS ),
			[ 'membership_fee' ]: createPayment(),
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
