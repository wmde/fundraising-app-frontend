import { GetterTree } from 'vuex';
import { BankAccount } from '@src/view_models/BankAccount';
import { Validity } from '@src/view_models/Validity';
import { looksLikeIban } from '@src/util/bank_account_number_helpers';

export const getters: GetterTree<BankAccount, any> = {
	bankDataIsInvalid: function ( state: BankAccount ): boolean {
		if ( state.values.accountNumber === '' || looksLikeIban( state.values.accountNumber ) ) {
			return state.validity.accountNumber === Validity.INVALID;
		}

		return state.validity.accountNumber === Validity.INVALID || state.validity.bankCode === Validity.INVALID;
	},
	bankDataIsValid: function ( state: BankAccount ): boolean {
		if ( state.values.accountNumber === '' || looksLikeIban( state.values.accountNumber ) ) {
			return state.validity.accountNumber === Validity.VALID;
		}

		return state.validity.accountNumber === Validity.VALID && state.validity.bankCode === Validity.VALID;
	},
	accountNumber: function ( state: BankAccount ): string {
		return state.values.accountNumber;
	},
	bankCode: function ( state: BankAccount ): string {
		return state.values.bankCode;
	},
	bankName: function ( state: BankAccount ): string {
		return state.values.bankName;
	},
};
