import { Module } from 'vuex';
import { Validity } from '@src/view_models/Validity';
import { actions } from '@src/store/bankdata/actions';
import { mutations } from '@src/store/bankdata/mutations';
import { BankAccount } from '@src/view_models/BankAccount';

export default function (): Module<BankAccount, any> {
	const state: BankAccount = {
		isValidating: false,
		validity: {
			iban: Validity.INCOMPLETE,
		},
		values: {
			bankName: '',
			iban: '',
			bic: '',
		},
	};

	const namespaced = true;

	return {
		namespaced,
		state,
		mutations,
		actions,
	};
}
