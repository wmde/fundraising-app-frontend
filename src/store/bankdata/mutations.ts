import { MutationTree } from 'vuex';
import { BankAccount } from '@src/view_models/BankAccount';
import { Validity } from '@src/view_models/Validity';
import { looksLikeIban } from '@src/util/bank_account_number_helpers';

export const mutations: MutationTree<BankAccount> = {
	VALIDATE_ACCOUNT_NUMBER( state: BankAccount ) {
		state.validity.accountNumber = state.values.accountNumber === '' ? Validity.INVALID : Validity.VALID;
	},
	SET_ACCOUNT_NUMBER( state: BankAccount, accountNumber: string ) {
		state.values.accountNumber = accountNumber;
	},
	SET_BANK_CODE( state: BankAccount, bankCode: string ) {
		state.values.bankCode = bankCode;
	},
	VALIDATE_BANK_CODE( state: BankAccount ) {
		state.validity.bankCode = state.values.bankCode === '' ? Validity.INVALID : Validity.VALID;
	},
	SET_BANK_NAME( state: BankAccount, bankName: string ) {
		state.values.bankName = bankName;
	},
	SET_IBAN( state: BankAccount, iban: string ) {
		state.values.iban = iban;
	},
	SET_BIC( state: BankAccount, bic: string ) {
		state.values.bic = bic;
	},
	SET_ACCOUNT_NUMBER_VALIDITY( state: BankAccount, validity: Validity ) {
		state.validity.accountNumber = validity;
	},
	SET_BANK_CODE_VALIDITY( state: BankAccount, validity: Validity ) {
		state.validity.bankCode = validity;
	},
	SET_IBAN_VALIDITY( state: BankAccount, validity: Validity ) {
		state.validity.iban = validity;
	},
	SET_IS_VALIDATING( state: BankAccount, isValidating: boolean ) {
		state.isValidating = isValidating;
	},
	MARK_EMPTY_FIELDS_INVALID( state: BankAccount ) {
		if ( [ Validity.INCOMPLETE, Validity.RESTORED ].includes( state.validity.accountNumber ) ) {
			state.validity.accountNumber = Validity.INVALID;
		}

		if ( looksLikeIban( state.values.accountNumber ) ) {
			state.validity.bankCode = Validity.INCOMPLETE;
		} else if ( [ Validity.INCOMPLETE, Validity.RESTORED ].includes( state.validity.bankCode ) ) {
			state.validity.bankCode = Validity.INVALID;
		}
	},
};
