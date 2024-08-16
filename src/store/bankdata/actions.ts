import { ActionContext } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { BankAccount, BankAccountData, BankAccountRequest } from '@src/view_models/BankAccount';
import { Validity } from '@src/view_models/Validity';

export const actions = {
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
	setBankData( context: ActionContext<BankAccount, any>, payload: BankAccountRequest ): Promise<void> {
		context.commit( 'SET_IS_VALIDATING', true );

		return axios( payload.validationUrl, {
			method: 'get',
			headers: { 'Content-Type': 'multipart/form-data' },
			params: payload.requestParams,
		} ).then( ( validationResult: AxiosResponse<{
			status: string;
			iban: string;
			bic: string;
			account: string;
			bankCode: string;
			bankName?: string;
		}> ) => {
			if ( validationResult.data.status === 'OK' ) {
				context.commit( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.VALID );
				context.commit( 'SET_BANK_CODE_VALIDITY', Validity.VALID );
				context.commit( 'SET_ACCOUNT_NUMBER', validationResult.data.account );
				context.commit( 'SET_BANK_CODE', validationResult.data.bankCode );
				context.commit( 'SET_BANK_NAME', validationResult.data.bankName );
				context.commit( 'SET_IBAN', validationResult.data.iban );
				context.commit( 'SET_BIC', validationResult.data.bic );
			} else {
				context.commit( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.INVALID );
				context.commit( 'SET_BANK_CODE_VALIDITY', Validity.INVALID );
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
		context.commit( 'VALIDATE_ACCOUNT_NUMBER' );
	},
	setBankCode( context: ActionContext<BankAccount, any>, payload: string ): void {
		context.commit( 'SET_BANK_CODE', payload );
		context.commit( 'VALIDATE_BANK_CODE' );
	},
	setBankName( context: ActionContext<BankAccount, any>, payload: string ): void {
		context.commit( 'SET_BANK_NAME', payload );
	},
	setIban( context: ActionContext<BankAccount, any>, payload: string ): void {
		context.commit( 'SET_IBAN', payload );
	},
	setBic( context: ActionContext<BankAccount, any>, payload: string ): void {
		context.commit( 'SET_BIC', payload );
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
