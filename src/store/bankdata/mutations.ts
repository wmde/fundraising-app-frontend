import { MutationTree } from 'vuex';
import { BankAccount } from '@src/view_models/BankAccount';
import { Validity } from '@src/view_models/Validity';

export const mutations: MutationTree<BankAccount> = {
	SET_BANKDATA( state: BankAccount, bankData: any ) {
		state.values.iban = bankData.accountId;
		state.values.bic = bankData.bankId;
	},
	SET_BANKNAME( state: BankAccount, bankName: string ) {
		state.values.bankName = bankName;
	},
	SET_BANK_DATA_VALIDITY( state: BankAccount, validity: Validity ) {
		state.validity.bankdata = validity;
	},
	SET_IS_VALIDATING( state: BankAccount, isValidating: boolean ) {
		state.isValidating = isValidating;
	},
	MARK_EMPTY_FIELDS_INVALID( state: BankAccount ) {
		if ( state.validity.bankdata === Validity.INCOMPLETE ) {
			state.validity.bankdata = Validity.INVALID;
		}
	},
	MARK_BANKDATA_INCOMPLETE( state: BankAccount ) {
		state.validity.bankdata = Validity.INCOMPLETE;
	},
};
