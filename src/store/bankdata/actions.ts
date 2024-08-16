import { ActionContext } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { BankAccount, BankAccountData, BankAccountRequest, BankAccountResponse } from '@src/view_models/BankAccount';
import { Validity } from '@src/view_models/Validity';

export const actions = {
	setBankData( context: ActionContext<BankAccount, any>, payload: BankAccountRequest ): Promise<void> {
		context.commit( 'SET_IS_VALIDATING', true );

		return axios( payload.validationUrl, {
			method: 'get',
			headers: { 'Content-Type': 'multipart/form-data' },
			params: payload.requestParams,
		} ).then( ( validationResult: AxiosResponse<BankAccountResponse> ) => {
			const validity = validationResult.data.status === 'ERR' ? Validity.INVALID : Validity.VALID;

			context.commit( 'SET_ACCOUNT_NUMBER_VALIDITY', validity );
			context.commit( 'SET_BANK_CODE_VALIDITY', validity );

			if ( validity === Validity.VALID ) {
				context.commit( 'SET_ACCOUNT_NUMBER', validationResult.data.accountNumber );
				context.commit( 'SET_BANK_CODE', validationResult.data.bankCode );
				context.commit( 'SET_BANK_NAME', validationResult.data.bankName );
			} else {
				context.commit( 'SET_BANK_NAME', '' );
			}

			context.commit( 'SET_IS_VALIDATING', false );
		} );
	},
	setValidating( context: ActionContext<BankAccount, any>, payload: boolean ): void {
		context.commit( 'SET_IS_VALIDATING', payload );
	},
	setAccountNumber( context: ActionContext<BankAccount, any>, payload: string ): void {
		context.commit( 'SET_ACCOUNT_NUMBER', payload );
	},
	setBankCode( context: ActionContext<BankAccount, any>, payload: string ): void {
		context.commit( 'SET_BANK_CODE', payload );
	},
	setBankName( context: ActionContext<BankAccount, any>, payload: string ): void {
		context.commit( 'SET_BANK_NAME', payload );
	},
	initializeBankData( context: ActionContext<BankAccount, any>, payload: BankAccountData ): void {
		context.commit( 'SET_ACCOUNT_NUMBER', payload.accountNumber );
		context.commit( 'SET_BANK_CODE', payload.bankCode );
		context.commit( 'SET_BANK_NAME', payload.bankName );

		if ( payload.accountNumber !== '' ) {
			context.commit( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.RESTORED );
		}

		if ( payload.bankCode !== '' ) {
			context.commit( 'SET_BANK_CODE_VALIDITY', Validity.RESTORED );
		}
	},
	markEmptyFieldsAsInvalid( context: ActionContext<BankAccount, any> ): void {
		context.commit( 'MARK_EMPTY_FIELDS_INVALID' );
	},
	setBankDataValidity( context: ActionContext<BankAccount, any>, payload: Validity ): void {
		context.commit( 'SET_ACCOUNT_NUMBER_VALIDITY', payload );
		context.commit( 'SET_BANK_CODE_VALIDITY', payload );
	},
	markBankDataAsIncomplete( context: ActionContext<BankAccount, any> ): void {
		context.commit( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.INCOMPLETE );
		context.commit( 'SET_BANK_CODE_VALIDITY', Validity.INCOMPLETE );
		context.commit( 'SET_BANK_NAME', '' );
	},
	markBankDataAsInvalid( context: ActionContext<BankAccount, any> ): void {
		context.commit( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.INVALID );
		context.commit( 'SET_BANK_CODE_VALIDITY', Validity.INVALID );
		context.commit( 'SET_BANK_NAME', '' );
	},
};
