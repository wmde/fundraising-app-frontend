import { Module } from 'vuex';
import { Payment } from '@src/view_models/Payment';
import { Validity } from '@src/view_models/Validity';
import { actions } from '@src/store/membership_fee/actions';
import { getters } from '@src/store/membership_fee/getters';
import { mutations } from '@src/store/membership_fee/mutations';

export default function (): Module<Payment, any> {
	const state: Payment = {
		isValidating: false,
		validity: {
			fee: Validity.INCOMPLETE,
			interval: Validity.INCOMPLETE,
			type: Validity.VALID,
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
