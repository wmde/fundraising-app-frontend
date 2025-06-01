import { MutationTree } from 'vuex';
import type { BankAccount } from '@src/view_models/BankAccount';
import { Validity } from '@src/view_models/Validity';

export const mutations: MutationTree<BankAccount> = {
	SET_BANK_NAME( state: BankAccount, bankName: string ) {
		state.values.bankName = bankName;
	},
	SET_IBAN( state: BankAccount, iban: string ) {
		state.values.iban = iban;
	},
	SET_BIC( state: BankAccount, bic: string ) {
		state.values.bic = bic;
	},
	SET_IBAN_VALIDITY( state: BankAccount, validity: Validity ) {
		state.validity.iban = validity;
	},
	SET_IS_VALIDATING( state: BankAccount, isValidating: boolean ) {
		state.isValidating = isValidating;
	},
	MARK_EMPTY_IBAN_INVALID( state: BankAccount ) {
		state.validity.iban = Validity.INVALID;
	},
};
