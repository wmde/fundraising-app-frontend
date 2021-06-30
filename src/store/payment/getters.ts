import { GetterTree } from 'vuex';
import { AmountValidity, Payment } from '@/view_models/Payment';
import { Validity } from '@/view_models/Validity';
import { validateAmount } from '@/store/amountValidator';

export const getters: GetterTree<Payment, any> = {
	amountIsValid: function ( state: Payment ): boolean {
		return state.validity.amount !== Validity.INVALID;
	},
	typeIsValid: function ( state: Payment ): boolean {
		return state.validity.type !== Validity.INVALID;
	},
	amountValidity: function ( state: Payment ): AmountValidity {
		if ( state.validity.amount !== Validity.INVALID ) {
			return AmountValidity.AMOUNT_VALID;
		}
		return validateAmount( Number( state.values.amount ) );
	},
	paymentDataIsValid: function ( state: Payment ): boolean {
		for ( const prop in state.validity ) {
			if ( state.validity[ prop ] !== Validity.VALID ) {
				return false;
			}
		}
		return true;
	},
	isDirectDebitPayment: function ( state: Payment ): boolean {
		return state.values.type === 'BEZ';
	},
	isBankTransferPayment: function ( state: Payment ): boolean {
		return state.values.type === 'UEB';
	},
	isExternalPayment: ( state: Payment ): boolean => {
		const externalPaymentTypes = [ 'PPL', 'MCP', 'SUB' ];
		return externalPaymentTypes.indexOf( state.values.type ) > -1;
	},
};
