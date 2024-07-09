import Vuex, { Store, StoreOptions } from 'vuex';
import createAddress from '@src/store/membership_address';
import createBankData from '@src/store/bankdata';
import createPayment from '@src/store/membership_fee';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from './namespaces';
import { InjectionKey } from 'vue';
import { FeeValidity } from '@src/view_models/MembershipFee';
import { Validity } from '@src/view_models/Validity';
import { validateFee } from '@src/store/feeValidator';

export function createStore( plugins: Array< ( s: Store<any> ) => void > = [] ) {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ NS_MEMBERSHIP_ADDRESS ]: createAddress(),
			[ NS_MEMBERSHIP_FEE ]: createPayment(),
			[ 'bankdata' ]: createBankData(),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state[ NS_MEMBERSHIP_FEE ].isValidating ||
					state[ NS_MEMBERSHIP_ADDRESS ].isValidating ||
					state.bankdata.isValidating;
			},
			paymentDataIsValid: function ( state, getters ): boolean {
				if ( state[ NS_MEMBERSHIP_FEE ].values.type === 'BEZ' ) {
					return getters[ NS_MEMBERSHIP_FEE + '/paymentDataIsValid' ] && getters[ 'bankdata/bankDataIsValid' ];
				} else {
					return getters[ NS_MEMBERSHIP_FEE + '/paymentDataIsValid' ];
				}
			},
			// Expose context-specific getter for checks in other contexts
			allPaymentValuesAreSet: function ( _, getters ): boolean {
				return getters[ NS_MEMBERSHIP_FEE + '/allPaymentValuesAreSet' ];
			},
			feeValidity: function ( state, getters ): FeeValidity {
				if ( state[ NS_MEMBERSHIP_FEE ].validity.fee !== Validity.INVALID ) {
					return FeeValidity.FEE_VALID;
				}
				return validateFee(
					Number( state[ NS_MEMBERSHIP_FEE ].values.fee ),
					getters[ NS_MEMBERSHIP_FEE + '/minimumAmount' ]( state[ NS_MEMBERSHIP_ADDRESS ].addressType )
				);
			},
		},
		plugins,
	};

	return new Vuex.Store<any>( storeBundle );
}

export const StoreKeyMembership: InjectionKey<Store<any>> = Symbol( 'Store' );
