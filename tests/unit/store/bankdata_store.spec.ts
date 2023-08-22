import { getters } from '@src/store/bankdata/getters';
import { actions } from '@src/store/bankdata/actions';
import { Validity } from '@src/view_models/Validity';
import each from 'jest-each';
import { BankAccount, BankAccountRequest, BankAccountResponse } from '@src/view_models/BankAccount';
import mockAxios from 'jest-mock-axios';
import { mutations } from '@src/store/bankdata/mutations';
import { MARK_BANKDATA_INCOMPLETE } from '@src/store/bankdata/mutationTypes';

function newMinimalStore( overrides: Object ): BankAccount {
	return Object.assign(
		{
			isValidating: false,
			validity: {
				bankdata: Validity.INCOMPLETE,
			},
			values: {
				bankName: '',
				bic: '',
				iban: '',
			},
		},
		overrides
	);
}

describe( 'BankData', () => {

	const testIban = 'DE12345605171238489890',
		testBIC = 'ABCDDEFFXXX',
		testAccount = '34560517',
		testBankCode = '50010517',
		testBankName = 'Cool Bank 3000';

	describe( 'Getters/bankDataIsInvalid', () => {
		it( 'does not return invalid bank data on initalization', () => {
			expect( getters.bankDataIsInvalid(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( false );
		} );

		const validityCases = [
			[ Validity.VALID, false ],
			[ Validity.INVALID, true ],
			[ Validity.INCOMPLETE, false ],
		];

		each( validityCases ).it( 'returns correct boolean representation of bank data validity (test index %#)',
			( bankDataValidity, isInvalid ) => {
				const state = {
					validity: {
						bankdata: bankDataValidity,
					},
				};
				expect( getters.bankDataIsInvalid(
					newMinimalStore( state ),
					null,
					null,
					null
				) ).toBe( isInvalid );
			},
		);
	} );

	describe( 'Getters/bankDataIsValid', () => {
		it( 'does not return valid bank data on initalization', () => {
			expect( getters.bankDataIsValid(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( false );
		} );

		const validityCases = [
			[ Validity.VALID, true ],
			[ Validity.INVALID, false ],
			[ Validity.INCOMPLETE, false ],
		];

		each( validityCases ).it( 'returns correct boolean representation of bank data validity (test index %#)',
			( bankDataValidity, isValid ) => {
				const state = {
					validity: {
						bankdata: bankDataValidity,
					},
				};
				expect( getters.bankDataIsValid(
					newMinimalStore( state ),
					null,
					null,
					null
				) ).toBe( isValid );
			},
		);
	} );

	describe( 'Getters/getBankName', () => {
		it( 'does not return a bank name on initalization', () => {
			expect( getters.getBankName(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( '' );
		} );

		it( 'does returns bank name from the store', () => {
			const state = {
				values: {
					bankName: 'Cool Bank 3000',
				},
			};
			expect( getters.getBankName(
				newMinimalStore( state ),
				null,
				null,
				null
			) ).toBe( 'Cool Bank 3000' );
		} );
	} );

	describe( 'Getters/getBankId', () => {
		it( 'does not return a bank identifier on initalization', () => {
			expect( getters.getBankId(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( '' );
		} );

		it( 'returns bank identifier from the store', () => {
			const state = {
				values: {
					bic: 'ABCDDEFFXXX',
				},
			};
			expect( getters.getBankId(
				newMinimalStore( state ),
				null,
				null,
				null
			) ).toBe( 'ABCDDEFFXXX' );
		} );
	} );

	describe( 'Actions/setBankData', () => {

		afterEach( function () {
			mockAxios.reset();
		} );

		it( 'commits to mutations [SET_BANK_DATA_VALIDITY], [SET_BANKNAME], [SET_BANKDATA], [SET_IS_VALIDATING]', () => {
			const context = {
					commit: jest.fn(),
				},
				payload = {
					validationUrl: '/check-iban',
					requestParams: { iban: testIban },
				} as BankAccountRequest,
				action = actions.setBankData as any;

			const actionResult = action( context, payload ).then( function () {
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_DATA_VALIDITY', Validity.VALID );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANKNAME', testBankName );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANKDATA', { accountId: testIban, bankId: testBIC } );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_IS_VALIDATING', true );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_IS_VALIDATING', false );
			} );

			mockAxios.mockResponse( {
				status: 200,
				data: {
					status: 'OK',
					bic: testBIC,
					iban: testIban,
					account: testAccount,
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
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_DATA_VALIDITY', Validity.INVALID );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_BANKNAME', '' );
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

			expect( context.commit ).toHaveBeenNthCalledWith( 1, 'MARK_BANKDATA_INCOMPLETE' );
			expect( context.commit ).toHaveBeenNthCalledWith( 2, 'SET_BANKNAME', '' );
		} );
	} );

	describe( 'actions/markBankDataAsInvalid', () => {
		it( 'commits SET_BANK_DATA_VALIDITY as invalid and SET_BANKNAME with an empty string', () => {
			const context = {
					commit: jest.fn(),
				},
				action = actions.markBankDataAsInvalid as any;
			action( context );

			expect( context.commit ).toHaveBeenNthCalledWith( 1, 'SET_BANK_DATA_VALIDITY', Validity.INVALID );
			expect( context.commit ).toHaveBeenNthCalledWith( 2, 'SET_BANKNAME', '' );
		} );
	} );

	function getState( overrides = {} ) {
		return {
			isValidating: false,
			validity: {
				bankdata: Validity.INCOMPLETE,
			},
			values: {
				iban: '',
				bic: '',
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
				payload = {
					accountId: testIban,
					bankId: testBIC,
					bankName: testBankName,
				},
				action = actions.initializeBankData as any;

			action( context, payload );

			expect( context.commit ).toHaveBeenCalledWith( 'SET_BANKDATA', {
				accountId: testIban,
				bankId: testBIC,
			} );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_BANKNAME', testBankName );
			expect( context.commit ).toHaveBeenCalledWith( 'SET_BANK_DATA_VALIDITY', Validity.VALID );
		} );
	} );

	describe( 'mutations/MARK_EMPTY_FIELDS_INVALID', () => {

		it( 'marks validity as invalid when validity is INCOMPLETE', () => {
			const state = getState();
			mutations.MARK_EMPTY_FIELDS_INVALID( state );
			expect( state.validity.bankdata ).toBe( Validity.INVALID );
		} );

		it( 'marks keeps validity validity is VALID', () => {
			const state = getState( { validity: { bankdata: Validity.VALID } } );
			mutations.MARK_EMPTY_FIELDS_INVALID( state );
			expect( state.validity.bankdata ).toBe( Validity.VALID );

		} );

		it( 'marks keeps validity validity is INVALID', () => {
			const state = getState( { validity: { bankdata: Validity.INVALID } } );
			mutations.MARK_EMPTY_FIELDS_INVALID( state );
			expect( state.validity.bankdata ).toBe( Validity.INVALID );
		} );

	} );
} );
