import { Module } from 'vuex';
import { Validity } from '@src/view_models/Validity';
import { actions } from '@src/store/bankdata/actions';
import { getters } from '@src/store/bankdata/getters';
import { mutations } from '@src/store/bankdata/mutations';
import { BankAccount } from '@src/view_models/BankAccount';

export default function (): Module<BankAccount, any> {
	const state: BankAccount = {
		isValidating: false,
		validity: {
			bankdata: Validity.INCOMPLETE,
		},
		values: {
			iban: '',
			bic: '',
			bankName: '',
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
