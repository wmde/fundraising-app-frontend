import { GetterTree } from 'vuex';
import { MembershipFee } from '@src/view_models/MembershipFee';
import { Validity } from '@src/view_models/Validity';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { MEMBERSHIP_MINIMUM_CENTS_FEE_COMPANY, MEMBERSHIP_MINIMUM_CENTS_FEE_PERSONAL } from '@src/store/membership_fee/constants';

export const getters: GetterTree<MembershipFee, any> = {
	feeIsValid: function ( state: MembershipFee ): boolean {
		return state.validity.fee !== Validity.INVALID;
	},
	typeIsValid: function ( state: MembershipFee ): boolean {
		return state.validity.type !== Validity.INVALID;
	},
	paymentDataIsValid: function ( state: MembershipFee ): boolean {
		for ( const prop in state.validity ) {
			if ( state.validity[ prop ] !== Validity.VALID ) {
				return false;
			}
		}
		return true;
	},
	allPaymentValuesAreSet: function ( state: MembershipFee ): boolean {
		return state.values.fee !== '' &&
			state.values.interval !== '' &&
			state.values.type !== '';
	},
	minimumAmount: ( state: MembershipFee ) => ( addressType: AddressTypeModel ): number => {
		const interval = Number( state.values.interval );
		if ( isNaN( interval ) ) {
			return 0;
		}
		const yearlyIntervalMultiplier = interval / 12;
		if ( addressType === AddressTypeModel.PERSON ) {
			return MEMBERSHIP_MINIMUM_CENTS_FEE_PERSONAL * yearlyIntervalMultiplier;
		}
		return MEMBERSHIP_MINIMUM_CENTS_FEE_COMPANY * yearlyIntervalMultiplier;
	},
	yearlyAmount: function ( state: MembershipFee ): number {
		const interval = Number( state.values.interval );
		const fee = Number( state.values.fee );
		if ( isNaN( interval ) || isNaN( fee ) ) {
			return 0;
		}
		return ( interval / 12 ) * fee;
	},
};
