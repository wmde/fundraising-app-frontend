import { MutationTree } from 'vuex';
import type { MembershipFee } from '@src/view_models/MembershipFee';
import { Validity } from '@src/view_models/Validity';

export const mutations: MutationTree<MembershipFee> = {
	MARK_EMPTY_FEE_INVALID( state: MembershipFee ) {
		const numericFee = Number( state.values.fee );
		state.validity.fee = ( isNaN( numericFee ) || numericFee <= 0 ) ?
			Validity.INVALID : Validity.VALID;
	},
	MARK_EMPTY_FIELDS_INVALID( state: MembershipFee ) {
		for ( const prop in state.values ) {
			if ( state.values[ prop ] === '' ) {
				state.validity[ prop ] = Validity.INVALID;
			}
		}
	},
	SET_FEE_VALIDITY( state: MembershipFee, validity: Validity ) {
		state.validity.fee = validity;
	},
	SET_INTERVAL_VALIDITY( state: MembershipFee, validity?: Validity ) {
		if ( validity === undefined ) {
			validity = state.values.interval === '' ? Validity.INVALID : Validity.VALID;
		}
		state.validity.interval = validity;
	},
	SET_TYPE_VALIDITY( state: MembershipFee, validity?: Validity ) {
		if ( validity === undefined ) {
			validity = state.values.type === '' ? Validity.INVALID : Validity.VALID;
		}
		state.validity.type = validity;
	},
	SET_FEE( state: MembershipFee, fee: string ) {
		if ( fee === '' || fee === '0' || fee === '0.0' ) {
			state.values.fee = '';
			return;
		}
		const euroAmount = fee.slice( 0, -2 );
		state.values.fee = parseInt( euroAmount, 10 ) > 0 ? fee.slice( 0, -2 ) + '00' : '0';
	},
	SET_INTERVAL( state: MembershipFee, interval: string ) {
		state.values.interval = interval;
	},
	SET_TYPE( state: MembershipFee, type: string ) {
		state.values.type = type;
	},
	SET_IS_VALIDATING( state: MembershipFee, isValidating ) {
		state.isValidating = isValidating;
	},
};
