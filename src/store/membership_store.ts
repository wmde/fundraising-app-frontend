import Vuex, { Store, StoreOptions } from 'vuex';
import createAddress from '@src/store/membership_address';
import createBankData from '@src/store/bankdata';
import createPayment from '@src/store/membership_fee';
import {
	NS_BANKDATA,
	NS_MEMBERSHIP_ADDRESS,
	NS_MEMBERSHIP_FEE,
} from './namespaces';
import { InjectionKey } from 'vue';

export function createStore( plugins: Array< ( s: Store<any> ) => void > = [] ) {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ NS_MEMBERSHIP_ADDRESS ]: createAddress(),
			[ NS_MEMBERSHIP_FEE ]: createPayment(),
			[ NS_BANKDATA ]: createBankData(),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state[ NS_MEMBERSHIP_FEE ].isValidating ||
					// TODO use getters instead
					state[ NS_MEMBERSHIP_ADDRESS ].serverSideValidationCount > 0 ||
					state[ NS_BANKDATA ].isValidating;
			},
			paymentDataIsValid: function ( state, getters ): boolean {
				if ( state[ NS_MEMBERSHIP_FEE ].values.type === 'BEZ' ) {
					return getters[ NS_MEMBERSHIP_FEE + '/paymentDataIsValid' ] && getters[ NS_BANKDATA + '/bankDataIsValid' ];
				} else {
					return getters[ NS_MEMBERSHIP_FEE + '/paymentDataIsValid' ];
				}
			},
			// Expose context-specific getter for checks in other contexts
			allPaymentValuesAreSet: function ( _, getters ): boolean {
				return getters[ NS_MEMBERSHIP_FEE + '/allPaymentValuesAreSet' ];
			},
		},
		plugins,
	};

	return new Vuex.Store<any>( storeBundle );
}

export const StoreKeyMembership: InjectionKey<Store<any>> = Symbol( 'Store' );
