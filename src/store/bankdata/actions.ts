import { ActionContext } from 'vuex';
import { BankAccount, InitialBankAccountData } from '@src/view_models/BankAccount';
import { Validity } from '@src/view_models/Validity';

export const actions = {
	initializeBankData( context: ActionContext<BankAccount, any>, payload: InitialBankAccountData ): void {
		context.commit( 'SET_BANK_NAME', payload.bankName );
		context.commit( 'SET_IBAN', payload.iban );
		context.commit( 'SET_BIC', payload.bic );

		if ( payload.iban !== '' ) {
			context.commit( 'SET_IBAN_VALIDITY', Validity.RESTORED );
		}
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
	markEmptyIbanAsInvalid( context: ActionContext<BankAccount, any> ): void {
		if ( [ Validity.INCOMPLETE, Validity.RESTORED ].includes( context.state.validity.iban ) ) {
			context.commit( 'MARK_EMPTY_IBAN_INVALID' );
		}
	},
	setIbanValidity( context: ActionContext<BankAccount, any>, payload: Validity ): void {
		context.commit( 'SET_IBAN_VALIDITY', payload );
	},
};
