import { Module } from 'vuex';
import { Validity } from '@src/view_models/Validity';
import { actions } from '@src/store/membership_fee/actions';
import { getters } from '@src/store/membership_fee/getters';
import { mutations } from '@src/store/membership_fee/mutations';
import type { MembershipFee } from '@src/view_models/MembershipFee';

export default function (): Module<MembershipFee, any> {
	const state: MembershipFee = {
		isValidating: false,
		validity: {
			fee: Validity.INCOMPLETE,
			interval: Validity.INCOMPLETE,
			type: Validity.INCOMPLETE,
		},
		values: {
			fee: '', // membership fee in cents
			interval: '',
			type: '',
		},
	};

	const namespaced = true;

	return {
		namespaced,
		state,
		getters,
		mutations,
		actions,
	};
}
