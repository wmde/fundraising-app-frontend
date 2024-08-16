import { getters } from '@src/store/bankdata/getters';
import { actions } from '@src/store/bankdata/actions';
import { Validity } from '@src/view_models/Validity';
import each from 'jest-each';
import { BankAccount, BankAccountData, BankAccountRequest, BankAccountResponse } from '@src/view_models/BankAccount';
import mockAxios from 'jest-mock-axios';
import { mutations } from '@src/store/bankdata/mutations';

function newMinimalStore( overrides: Object = {} ): BankAccount {
	return Object.assign(
		{
			isValidating: false,
			validity: {
				accountNumber: Validity.INCOMPLETE,
				bankCode: Validity.INCOMPLETE,
			},
			values: {
				accountNumber: '',
				bankCode: '',
				bankName: '',
			},
		},
		overrides
	);
}

describe( 'BankData', () => {

	const testIban = 'DE12345605171238489890',
		testAccount = '34560517',
		testBankCode = '50010517',
		testBankName = 'Cool Bank 3000';

	describe( 'Getters/bankDataIsInvalid', () => {
		it( 'does not return invalid bank data on initalization', () => {
			expect( getters.bankDataIsInvalid( newMinimalStore(), null, null, null ) ).toBe( false );
		} );

		each( [
			[ Validity.VALID, Validity.INCOMPLETE, '', false ],
			[ Validity.INVALID, Validity.INCOMPLETE, '', true ],
			[ Validity.INCOMPLETE, Validity.INCOMPLETE, '', false ],
			[ Validity.VALID, Validity.INCOMPLETE, testIban, false ],
			[ Validity.INVALID, Validity.INCOMPLETE, testIban, true ],
			[ Validity.INCOMPLETE, Validity.INCOMPLETE, testIban, false ],
			[ Validity.INCOMPLETE, Validity.INCOMPLETE, '$$ Not IBAN $$', false ],
			[ Validity.INVALID, Validity.INCOMPLETE, '$$ Not IBAN $$', true ],
			[ Validity.INCOMPLETE, Validity.INVALID, '$$ Not IBAN $$', true ],
			[ Validity.INVALID, Validity.INVALID, '$$ Not IBAN $$', true ],
		] ).it( 'returns correct invalidity (test index %#)', (
			accountNumberValidity: Validity,
			bankCodeValidity: Validity,
			accountNumber: string,
			isInvalid: boolean
		) => {
			const store = newMinimalStore();
			store.validity.accountNumber = accountNumberValidity;
			store.validity.bankCode = bankCodeValidity;
			store.values.accountNumber = accountNumber;

			expect( getters.bankDataIsInvalid( store, null, null, null ) ).toBe( isInvalid );
		} );
	} );

	describe( 'Getters/bankDataIsValid', () => {
		it( 'does not return valid bank data on initalization', () => {
			expect( getters.bankDataIsValid( newMinimalStore(), null, null, null ) ).toBe( false );
		} );

		each( [
			[ Validity.VALID, Validity.INCOMPLETE, '', true ],
			[ Validity.INVALID, Validity.INCOMPLETE, '', false ],
			[ Validity.INCOMPLETE, Validity.INCOMPLETE, '', false ],
			[ Validity.VALID, Validity.INCOMPLETE, testIban, true ],
			[ Validity.INVALID, Validity.INCOMPLETE, testIban, false ],
			[ Validity.INCOMPLETE, Validity.INCOMPLETE, testIban, false ],
			[ Validity.INCOMPLETE, Validity.INCOMPLETE, '$$ Not IBAN $$', false ],
			[ Validity.VALID, Validity.INCOMPLETE, '$$ Not IBAN $$', false ],
			[ Validity.INCOMPLETE, Validity.VALID, '$$ Not IBAN $$', false ],
			[ Validity.VALID, Validity.VALID, '$$ Not IBAN $$', true ],
		] ).it( 'returns correct boolean representation of bank data validity (test index %#)', (
			accountNumberValidity: Validity,
			bankCodeValidity: Validity,
			accountNumber: string,
			isValid: boolean
		) => {
			const store = newMinimalStore();
			store.validity.accountNumber = accountNumberValidity;
			store.validity.bankCode = bankCodeValidity;
			store.values.accountNumber = accountNumber;

			expect( getters.bankDataIsValid( store, null, null, null ) ).toBe( isValid );
		} );
	} );

	describe( 'Getters/accountNumber', () => {
		it( 'does not return a bank identifier on initalization', () => {
			expect( getters.accountNumber( newMinimalStore(), null, null, null ) ).toBe( '' );
		} );

		it( 'returns bank identifier from the store', () => {
			const store = newMinimalStore();
			store.values.accountNumber = 'ABCDDEFFXXX';

			expect( getters.accountNumber( store, null, null, null ) ).toBe( 'ABCDDEFFXXX' );
		} );
	} );

	describe( 'Getters/bankCode', () => {
		it( 'does not return a bank identifier on initalization', () => {
			expect( getters.bankCode( newMinimalStore(), null, null, null ) ).toBe( '' );
		} );

		it( 'returns bank identifier from the store', () => {
			const store = newMinimalStore();
			store.values.bankCode = 'ABCDDEFFXXX';

			expect( getters.bankCode( store, null, null, null ) ).toBe( 'ABCDDEFFXXX' );
		} );
	} );

	describe( 'Getters/bankName', () => {
		it( 'does not return a bank name on initalization', () => {
			expect( getters.bankName( newMinimalStore(), null, null, null ) ).toBe( '' );
		} );

		it( 'does returns bank name from the store', () => {
			const store = newMinimalStore();
			store.values.bankName = 'Cool Bank 3000';

			expect( getters.bankName( store, null, null, null ) ).toBe( 'Cool Bank 3000' );
		} );
	} );

	describe( 'Actions/setBankData', () => {

		afterEach( function () {
			mockAxios.reset();
		} );

		it( 'commits to the required mutations', () => {
			const context = {
					commit: jest.fn(),
				},
				payload = {
					validationUrl: '/check-iban',
					requestParams: { iban: testAccount },
				} as BankAccountRequest,
				action = actions.setBankData as any;

			const actionResult = action( context, payload ).then( function () {
				expect( context.commit ).toHaveBeenCalledWith( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.VALID );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_CODE_VALIDITY', Validity.VALID );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_ACCOUNT_NUMBER', testAccount );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_CODE', testBankCode );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_NAME', testBankName );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_IS_VALIDATING', true );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_IS_VALIDATING', false );
			} );

			mockAxios.mockResponse( {
				status: 200,
				data: {
					status: 'OK',
					accountNumber: testAccount,
					bankCode: testBankCode,
					bankName: testBankName,
				} as BankAccountResponse,
			} );

			return actionResult;
		} );

		it( 'resets the bank name via [SET_BANKNAME] on invalid account data', () => {
			const context = {
					commit: jest.fn(),
				},
				payload = {
					validationUrl: '/check-iban',
					requestParams: { iban: testIban },
				} as BankAccountRequest,
				action = actions.setBankData as any;

			const actionResult = action( context, payload ).then( function () {
				expect( context.commit ).toHaveBeenCalledWith( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.INVALID );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_CODE_VALIDITY', Validity.INVALID );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_NAME', '' );
			} );
			mockAxios.mockResponse( {
				status: 200,
				data: {
					status: 'ERR',
				} as BankAccountResponse,
			} );
			return actionResult;
		} );
	} );

	describe( 'actions/markEmptyValuesAsInvalid', () => {
		it( 'commits MARK_EMPTY_FIELDS_INVALID', () => {
			const context = {
					commit: jest.fn(),
				},
				action = actions.markEmptyFieldsAsInvalid as any;
			action( context );

			expect( context.commit ).toHaveBeenCalledWith( 'MARK_EMPTY_FIELDS_INVALID' );
		} );
	} );

	describe( 'actions/markBankDataAsIncomplete', () => {
		it( 'commits MARK_BANKDATA_INCOMPLETE', () => {
			const context = {
					commit: jest.fn(),
				},
				action = actions.markBankDataAsIncomplete as any;
			action( context );

			expect( context.commit ).toHaveBeenNthCalledWith( 1, 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.INCOMPLETE );
			expect( context.commit ).toHaveBeenNthCalledWith( 2, 'SET_BANK_CODE_VALIDITY', Validity.INCOMPLETE );
			expect( context.commit ).toHaveBeenNthCalledWith( 3, 'SET_BANK_NAME', '' );
		} );
	} );

	describe( 'actions/markBankDataAsInvalid', () => {
		it( 'commits SET_BANK_DATA_VALIDITY as invalid and SET_BANKNAME with an empty string', () => {
			const context = {
					commit: jest.fn(),
				},
				action = actions.markBankDataAsInvalid as any;
			action( context );

			expect( context.commit ).toHaveBeenNthCalledWith( 1, 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.INVALID );
			expect( context.commit ).toHaveBeenNthCalledWith( 2, 'SET_BANK_CODE_VALIDITY', Validity.INVALID );
			expect( context.commit ).toHaveBeenNthCalledWith( 3, 'SET_BANK_NAME', '' );
		} );
	} );

	function getState( overrides = {} ): BankAccount {
		return {
			isValidating: false,
			validity: {
				accountNumber: Validity.INCOMPLETE,
				bankCode: Validity.INCOMPLETE,
			},
			values: {
				accountNumber: '',
				bankCode: '',
				bankName: '',
			},
			...overrides,
		};
	}

	describe( 'Actions/initializeBankData', () => {
		it( 'commits the data to the internal state', () => {
			const context = {
					commit: jest.fn(),
				},
				payload: BankAccountData = {
					accountNumber: testIban,
					bankCode: testBankCode,
					bankName: testBankName,
				},
				action = actions.initializeBankData as any;

			action( context, payload );

			expect( context.commit ).toHaveBeenCalledWith( 'SET_ACCOUNT_NUMBER', testIban );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_CODE', testBankCode );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_NAME', testBankName );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.RESTORED );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_CODE_VALIDITY', Validity.RESTORED );
		} );

		it( 'does not restore validity if fields are empty', () => {
			const context = {
					commit: jest.fn(),
				},
				payload: BankAccountData = {
					accountNumber: '',
					bankCode: '',
					bankName: '',
				},
				action = actions.initializeBankData as any;

			action( context, payload );

			expect( context.commit ).not.toHaveBeenCalledWith( 'SET_ACCOUNT_NUMBER_VALIDITY', Validity.RESTORED );
			expect( context.commit ).not.toHaveBeenCalledWith( 'SET_BANK_CODE_VALIDITY', Validity.RESTORED );
		} );
	} );

	describe( 'mutations/MARK_EMPTY_FIELDS_INVALID', () => {

		test.each( [
			[ Validity.INCOMPLETE, Validity.INVALID ],
			[ Validity.RESTORED, Validity.INVALID ],
			[ Validity.INVALID, Validity.INVALID ],
			[ Validity.VALID, Validity.VALID ],
		] )( 'updates account number validity', ( startValidity: Validity, endValidity: Validity ) => {
			const state = getState();
			state.validity.accountNumber = startValidity;
			state.values.accountNumber = testIban;
			mutations.MARK_EMPTY_FIELDS_INVALID( state );

			expect( state.validity.accountNumber ).toBe( endValidity );
		} );

		test.each( [
			[ Validity.INCOMPLETE, testIban, Validity.INCOMPLETE ],
			[ Validity.RESTORED, testIban, Validity.INCOMPLETE ],
			[ Validity.INVALID, testIban, Validity.INCOMPLETE ],
			[ Validity.VALID, testIban, Validity.INCOMPLETE ],
			[ Validity.INCOMPLETE, '', Validity.INVALID ],
			[ Validity.RESTORED, '', Validity.INVALID ],
			[ Validity.INVALID, '', Validity.INVALID ],
			[ Validity.VALID, '', Validity.VALID ],
		] )( 'updates bank code validity', ( startValidity: Validity, accountNumber: string, endValidity: Validity ) => {
			const state = getState();
			state.validity.bankCode = startValidity;
			state.values.accountNumber = accountNumber;
			mutations.MARK_EMPTY_FIELDS_INVALID( state );

			expect( state.validity.bankCode ).toBe( endValidity );
		} );
	} );
} );
