import Vuex, { Store, StoreOptions } from 'vuex';
import createAddress from '@src/store/membership_address';
import createBankData from '@src/store/bankdata';
import createPayment from '@src/store/membership_fee';
import { FeeValidity } from '@src/view_models/MembershipFee';
import { Validity } from '@src/view_models/Validity';
import { validateFee } from '@src/store/feeValidator';

export function createStore( plugins: Array< ( s: Store<any> ) => void > = [] ) {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ 'membership_address' ]: createAddress(),
			[ 'membership_fee' ]: createPayment(),
			[ 'bankdata' ]: createBankData(),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state.membership_fee.isValidating ||
					state.membership_address.isValidating ||
					state.bankdata.isValidating;
			},
			paymentDataIsValid: function ( state, getters ): boolean {
				if ( state.membership_fee.values.type === 'BEZ' ) {
					return getters[ 'membership_fee/paymentDataIsValid' ] && getters[ 'bankdata/bankDataIsValid' ];
				} else {
					return getters[ 'membership_fee/paymentDataIsValid' ];
				}
			},
			// Expose context-specific getter for checks in other contexts
			allPaymentValuesAreSet: function ( _, getters ): boolean {
				return getters[ 'membership_fee/allPaymentValuesAreSet' ];
			},
			feeValidity: function ( state, getters ): FeeValidity {
				if ( state.membership_fee.validity.fee !== Validity.INVALID ) {
					return FeeValidity.FEE_VALID;
				}
				return validateFee(
					Number( state.membership_fee.values.fee ),
					getters[ 'membership_fee/minimumAmount' ]( state.membership_address.addressType )
				);
			},
		},
		plugins,
	};

	return new Vuex.Store<any>( storeBundle );
}
