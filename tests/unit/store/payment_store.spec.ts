import { getters } from '@/store/payment/getters';
import { actions } from '@/store/payment/actions';
import { mutations } from '@/store/payment/mutations';
import { Validity } from '@/view_models/Validity';
import { AmountValidity } from '@/view_models/Payment';
import {
	initializePayment,
	markEmptyAmountAsInvalid,
} from '@/store/payment/actionTypes';
import {
	SET_AMOUNT,
	SET_AMOUNT_VALIDITY,
	SET_INTERVAL,
	SET_TYPE,
	SET_TYPE_VALIDITY,
} from '@/store/payment/mutationTypes';
import each from 'jest-each';
import mockAxios from 'jest-mock-axios';
import { DonationPayment } from '@/store/payment/types';

function newMinimalStore( overrides: Object ): DonationPayment {
	return Object.assign(
		{
			isValidating: false,
			validity: {
				amount: Validity.INCOMPLETE,
				type: Validity.INCOMPLETE,
			},
			values: {
				amount: '',
				interval: '0',
				type: '',
			},
			initialized: false,
		},
		overrides
	);
}

describe( 'Payment', () => {

	const validityCases = [
		[ Validity.VALID, true ],
		[ Validity.INVALID, false ],
		[ Validity.INCOMPLETE, true ],
	];

	describe( 'Getters/amountIsValid', () => {
		it( 'does not return invalid amount on initalization', () => {
			expect( getters.amountIsValid(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( true );
		} );

		each( validityCases ).it( 'converts validity types to boolean state (test index %#)',
			( amountValidity, isValid ) => {
				const state = {
					validity: {
						amount: amountValidity,
						type: Validity.INCOMPLETE,
					},
				};
				expect( getters.amountIsValid(
					newMinimalStore( state ),
					null,
					null,
					null
				) ).toBe( isValid );
			},
		);
	} );

	describe( 'Getters/amountValidity', () => {
		const invalidCentAmountsTooLow = [ 0, 99 ];
		const invalidCentAmountsTooHigh = [ 10000000, 10000001 ];
		const validCentAmounts = [ 100, 9999999 ];

		it( 'does not return invalid amount on initalization', () => {
			expect( getters.amountValidity(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( AmountValidity.AMOUNT_VALID );
		} );

		each( validCentAmounts ).it( 'does not return invalid amount on valid donation amount (cents)', ( validAmount ) => {
			expect( getters.amountValidity(
				newMinimalStore( { values: { amount: validAmount } } ),
				null,
				null,
				null
			) ).toBe( AmountValidity.AMOUNT_VALID );
		} );

		each( invalidCentAmountsTooLow ).it( 'returns amount too low error on minimum donation amounts (cents)', ( tooLowAmount ) => {
			expect( getters.amountValidity(
				newMinimalStore( { values: { amount: tooLowAmount }, validity: { amount: Validity.INVALID } } ),
				null,
				null,
				null
			) ).toBe( AmountValidity.AMOUNT_TOO_LOW );
		} );

		each( invalidCentAmountsTooHigh ).it( 'returns amount too high error on maximum donation amounts (cents)', ( tooHighAmount ) => {
			expect( getters.amountValidity(
				newMinimalStore( { values: { amount: tooHighAmount }, validity: { amount: Validity.INVALID } } ),
				null,
				null,
				null
			) ).toBe( AmountValidity.AMOUNT_TOO_HIGH );
		} );
	} );

	describe( 'Getters/typeIsValid', () => {
		it( 'does not return invalid payment type on initalization', () => {
			expect( getters.typeIsValid(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( true );
		} );

		each( validityCases ).it(
			'returns the expected validity for a given type (test index %#)',
			( typeValidity, isValid ) => {
				const state = {
					validity: {
						amount: Validity.INCOMPLETE,
						type: typeValidity,
					},
				};
				expect( getters.typeIsValid(
					newMinimalStore( state ),
					null,
					null,
					null
				) ).toBe( isValid );
			},
		);
	} );

	describe( 'Getters/isExternalPayment', () => {
		const externalPaymentTypes = [ 'PPL', 'MCP', 'SUB' ];
		const nonExternalPaymentTypes = [ 'UEB', 'BEZ' ];

		each( externalPaymentTypes ).it( 'returns true for external payments', ( paymentType ) => {
			expect( getters.isExternalPayment(
				newMinimalStore( { values: { type: paymentType } } ),
				null,
				null,
				null
			) ).toBe( true );
		} );

		each( nonExternalPaymentTypes ).it( 'returns false for non-external payments', ( paymentType ) => {
			expect( getters.isExternalPayment(
				newMinimalStore( { values: { type: paymentType } } ),
				null,
				null,
				null
			) ).toBe( false );
		} );
	} );

	describe( 'Actions/initializePayment', () => {
		it( 'does not commit empty amount', () => {
			const commit = jest.fn();
			const action = actions[ initializePayment ] as any;
			const payload = {
				initialValues: {
					amount: '0',
					type: 'BEZ',
					paymentIntervalInMonths: 12,
				},
				maxAmount: 100000,
			};
			action( { commit }, payload );
			expect( commit ).not.toBeCalledWith( SET_AMOUNT, '0' );
		} );

		it( 'commits amount and sets it to valid when amount is set', () => {
			const commit = jest.fn();
			const action = actions[ initializePayment ] as any;
			const payload = {
				initialValues: {
					amount: '2399',
					type: 'BEZ',
					paymentIntervalInMonths: 12,
				},
				maxAmount: 100000,
			};
			action( { commit }, payload );
			expect( commit ).toBeCalledWith( SET_AMOUNT, '2399' );
			expect( commit ).toBeCalledWith( SET_AMOUNT_VALIDITY, Validity.VALID );
		} );

		it( 'does not commit empty payment type', () => {
			const commit = jest.fn();
			const action = actions[ initializePayment ] as any;
			const payload = {
				initialValues: {
					amount: '123',
					type: '',
					paymentIntervalInMonths: 12,
				},
				maxAmount: 100000,
			};
			action( { commit }, payload );
			expect( commit ).not.toBeCalledWith( SET_TYPE, '' );
		} );

		it( 'commits payment type and set it to valid when payment type is set', () => {
			const commit = jest.fn();
			const action = actions[ initializePayment ] as any;
			const payload = {
				initialValues: {
					amount: '2399',
					type: 'BEZ',
					paymentIntervalInMonths: 12,
				},
				maxAmount: 100000,
			};
			action( { commit }, payload );
			expect( commit ).toBeCalledWith( SET_TYPE, 'BEZ' );
			expect( commit ).toBeCalledWith( SET_TYPE_VALIDITY, Validity.VALID );
		} );

		it( 'commits interval', () => {
			const commit = jest.fn();
			const action = actions[ initializePayment ] as any;
			const payload = {
				initialValues: {
					amount: '2399',
					type: 'BEZ',
					paymentIntervalInMonths: '12',
				},
				maxAmount: 100000,
			};
			action( { commit }, payload );
			expect( commit ).toBeCalledWith( SET_INTERVAL, '12' );
		} );

		const paymentAndAmountCases = [
			{ amount: '', type: '', expectedResolution: false },
			{ amount: '0', type: 'BEZ', expectedResolution: false },
			{ amount: '1234', type: '', expectedResolution: false },
			{ amount: '4200', type: 'PPL', expectedResolution: true },
			{ amount: '100000', type: 'PPL', expectedResolution: false },
		];

		describe.each( paymentAndAmountCases )( 'with initial payment data', ( data: any ) => {
			it( `whose amount is ${ data.amount } and type is ${ data.type } should be ${ data.expectedResolution }`, () => {
				const commit = jest.fn();
				const action = actions[ initializePayment ] as any;
				const payload = {
					initialValues: {
						amount: data.amount,
						type: data.type,
						paymentIntervalInMonths: '0',
					},
					maxAmount: 100000,
				};
				expect.assertions( 1 );
				return expect( action( { commit }, payload ) ).resolves.toBe( data.expectedResolution );
			} );
		} );
	} );

	describe( 'Actions/markEmptyAmountAsInvalid', () => {
		it( 'commits to mutation [MARK_EMPTY_AMOUNT_INVALID]', () => {
			const commit = jest.fn();
			const action = actions[ markEmptyAmountAsInvalid ] as any;
			action( { commit } );
			expect( commit ).toBeCalledWith(
				'MARK_EMPTY_AMOUNT_INVALID'
			);
		} );
	} );

	describe( 'Actions/markEmptyValuesAsInvalid', () => {
		it( 'commits to mutation [MARK_EMPTY_FIELDS_INVALID]', () => {
			const context = {
				commit: jest.fn(),
				getters: {
					'payment/paymentDataIsValid': true,
				},
			};
			const action = actions.markEmptyValuesAsInvalid as any;
			action( context );
			expect( context.commit ).toBeCalledWith(
				'MARK_EMPTY_FIELDS_INVALID'
			);
		} );
	} );

	describe( 'Actions/setInterval', () => {
		it( 'commits to mutation [SET_INTERVAL]', () => {
			const context = {
				commit: jest.fn(),
			};
			const action = actions.setInterval as any;
			action( context, 3 );
			expect( context.commit ).toBeCalledWith(
				'SET_INTERVAL',
				3
			);
		} );
	} );

	describe( 'Actions/setType', () => {
		it( 'commits to mutation [SET_TYPE]', () => {
			const context = {
				commit: jest.fn(),
			};
			const action = actions.setType as any;
			action( context, 'BEZ' );
			expect( context.commit ).toBeCalledWith(
				'SET_TYPE',
				'BEZ'
			);
		} );
		it( 'commits to mutation [SET_TYPE_VALIDITY]', () => {
			const context = {
				commit: jest.fn(),
			};
			const action = actions.setType as any;
			action( context );
			expect( context.commit ).toBeCalledWith(
				'SET_TYPE_VALIDITY'
			);
		} );
	} );

	describe( 'Actions/setAmount', () => {

		afterEach( function () {
			mockAxios.reset();
		} );

		it( 'commits to mutation [SET_AMOUNT]', () => {
			const context = {
					commit: jest.fn(),
				},
				payload = {
					amountValue: '2500',
					validateAmountUrl: '/validation-amount-url',
				};
			const action = actions.setAmount as any;
			const actionResult = action( context, payload ).then( function () {
				expect( context.commit ).toHaveBeenCalledWith(
					'SET_AMOUNT',
					payload.amountValue
				);
			} );

			mockAxios.mockResponse( {
				status: 200,
				data: {
					'status': 'OK',
				},
			} );

			return actionResult;
		} );

		it( 'sends a post request for amount validation', () => {
			const context = {
					commit: jest.fn(),
				},
				payload = {
					amountValue: '2500',
					validateAmountUrl: '/validation-amount-url',
				},
				bodyFormData = new FormData();
			bodyFormData.append( 'amount', payload.amountValue );

			const action = actions.setAmount as any;
			const actionResult = action( context, payload ).then( function () {
				expect( mockAxios.post ).toHaveBeenCalledWith(
					payload.validateAmountUrl,
					bodyFormData,
					{ headers: { 'Content-Type': 'multipart/form-data' } }
				);
			} );

			mockAxios.mockResponse( {
				status: 200,
				data: {
					'status': 'OK',
				},
			} );

			return actionResult;
		} );

		it( 'commits to mutation [SET_AMOUNT_VALIDITY] and [SET_IS_VALIDATING] on server side validation', () => {
			const context = {
					commit: jest.fn(),
				},
				payload = {
					amountValue: '2500',
					validateAmountUrl: '/validation-amount-url',
				},
				action = actions.setAmount as any;

			const actionResult = action( context, payload ).then( function () {
				expect( context.commit ).toHaveBeenCalledWith( 'SET_AMOUNT_VALIDITY', Validity.VALID );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_IS_VALIDATING', true );
				expect( context.commit ).toHaveBeenCalledWith( 'SET_IS_VALIDATING', false );
			} );

			mockAxios.mockResponse( {
				status: 200,
				data: {
					'status': 'OK',
				},
			} );

			return actionResult;
		} );
	} );

	describe( 'Mutations/MARK_EMPTY_AMOUNT_INVALID', () => {
		const amountStates = [
			[ { values: { amount: '1' } }, Validity.VALID ],
			[ { values: { amount: '' } }, Validity.INVALID ],
			[ { values: { amount: '0' } }, Validity.INVALID ],
			[ { values: { amount: 'hello' } }, Validity.INVALID ],
		];

		each( amountStates ).it(
			'mutates the state with the correct validity for a given amount (test index %#)',
			( amountState, expectedValidity ) => {
				const store = newMinimalStore( amountState );
				mutations.MARK_EMPTY_AMOUNT_INVALID( store, {} );
				expect( store.validity.amount ).toStrictEqual( expectedValidity );
			} );
	} );

	describe( 'Mutations/SET_AMOUNT_VALIDITY', () => {
		it( 'mutates the amount validity', () => {
			const store = newMinimalStore( {} );
			mutations.SET_AMOUNT_VALIDITY( store, Validity.VALID );
			expect( store.validity.amount ).toStrictEqual( Validity.VALID );
			mutations.SET_AMOUNT_VALIDITY( store, Validity.INVALID );
			expect( store.validity.amount ).toStrictEqual( Validity.INVALID );
		} );
	} );

	describe( 'Mutations/SET_AMOUNT', () => {
		it( 'mutates the amount', () => {
			const store = newMinimalStore( {} );
			mutations.SET_AMOUNT( store, 2500 );
			expect( store.values.amount ).toStrictEqual( 2500 );
			mutations.SET_AMOUNT( store, 5500 );
			expect( store.values.amount ).toStrictEqual( 5500 );
		} );
	} );

	describe( 'Mutations/SET_INTERVAL', () => {
		it( 'mutates the interval', () => {
			const store = newMinimalStore( {} );
			mutations.SET_INTERVAL( store, 3 );
			expect( store.values.interval ).toStrictEqual( 3 );
			mutations.SET_INTERVAL( store, 0 );
			expect( store.values.interval ).toStrictEqual( 0 );
		} );
	} );

	describe( 'Mutations/SET_TYPE', () => {
		it( 'mutates the payment type', () => {
			const store = newMinimalStore( {} );
			mutations.SET_TYPE( store, 'UEB' );
			expect( store.values.type ).toStrictEqual( 'UEB' );
			mutations.SET_TYPE( store, 'BEZ' );
			expect( store.values.type ).toStrictEqual( 'BEZ' );
		} );
	} );
} );
