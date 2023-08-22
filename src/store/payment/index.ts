import { Module } from 'vuex';
import { Validity } from '@src/view_models/Validity';
import { actions } from '@src/store/payment/actions';
import { getters } from '@src/store/payment/getters';
import { mutations } from '@src/store/payment/mutations';
import { DonationPayment } from '@src/store/payment/types';

export default function (): Module<DonationPayment, any> {
	const state: DonationPayment = {
		isValidating: false,
		validity: {
			amount: Validity.INCOMPLETE,
			type: Validity.INCOMPLETE,
		},
		values: {
			amount: '', // amount in cents
			interval: '0',
			type: '',
		},
		initialized: false,
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
