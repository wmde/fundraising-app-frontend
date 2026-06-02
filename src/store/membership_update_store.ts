import Vuex, { StoreOptions } from 'vuex';
import createAddress from '@src/store/membership_address';

export function createMembershipUpdateStore() {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ 'membership_address' ]: createAddress(),
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
