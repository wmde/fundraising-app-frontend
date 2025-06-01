import { actions } from '@src/store/bankdata/actions';
import { Validity } from '@src/view_models/Validity';
import type { InitialBankAccountData } from '@src/view_models/BankAccount';
import { bankName, BIC, IBAN } from '@test/data/bankdata';

describe( 'BankData', () => {
	describe( 'Actions/initializeBankData', () => {
		it( 'commits the data to the internal state', () => {
			const context = {
					commit: jest.fn(),
				},
				payload: InitialBankAccountData = {
					iban: IBAN,
					bic: BIC,
					bankName: bankName,
				},
				action = actions.initializeBankData as any;

			action( context, payload );

			expect( context.commit ).toHaveBeenCalledWith( 'SET_IBAN', IBAN );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_BIC', BIC );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_NAME', bankName );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_IBAN_VALIDITY', Validity.RESTORED );
		} );

		it( 'does not restore IBAN validity if empty', () => {
			const context = {
					commit: jest.fn(),
				},
				payload: InitialBankAccountData = {
					iban: '',
					bic: BIC,
					bankName: bankName,
				},
				action = actions.initializeBankData as any;

			action( context, payload );

			expect( context.commit ).not.toHaveBeenCalledWith( 'SET_IBAN_VALIDITY', Validity.RESTORED );
		} );
	} );

	describe( 'Actions/initializeBankData', () => {
		test.each( [
			[ Validity.INCOMPLETE ],
			[ Validity.RESTORED ],
		] )( 'marks iban as invalid', ( validity: Validity ) => {
			const context = {
				commit: jest.fn(),
				state: {
					validity: {
						iban: validity,
					},
				},
			};
			const action = actions.markEmptyIbanAsInvalid as any;

			action( context );

			expect( context.commit ).toHaveBeenCalledWith( 'MARK_EMPTY_IBAN_INVALID' );
		} );
	} );
} );
