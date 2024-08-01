import { getters } from '@src/store/payment/getters';
import { actions } from '@src/store/payment/actions';
import { mutations } from '@src/store/payment/mutations';
import { Validity } from '@src/view_models/Validity';
import { AmountValidity } from '@src/view_models/Payment';
import each from 'jest-each';
import { DonationPayment } from '@src/store/payment/types';
import { ActionContext } from 'vuex';
import { PaymentType } from '@src/view_models/PaymentType';
import { PaymentInitialisationPayload } from '@src/view_models/PaymentInitialisationPayload';

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
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 12 ],
				allowedPaymentTypes: [ 'BEZ' ],
				initialValues: {
					amount: '0',
					type: 'BEZ',
					paymentIntervalInMonths: '12',
					isCustomAmount: false,
				},
			};

			action( { commit }, payload );
			expect( commit ).not.toBeCalledWith( 'SET_AMOUNT', '0' );
		} );

		it( 'commits amount and sets it to valid when amount is set', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 12 ],
				allowedPaymentTypes: [ 'BEZ' ],
				initialValues: {
					amount: '2399',
					type: 'BEZ',
					paymentIntervalInMonths: '12',
					isCustomAmount: true,
				},
			};

			action( { commit }, payload );
			expect( commit ).toBeCalledWith( 'SET_AMOUNT', '2399' );
			expect( commit ).toBeCalledWith( 'SET_AMOUNT_VALIDITY', Validity.VALID );
		} );

		it( 'does not commit empty payment type', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 12 ],
				allowedPaymentTypes: [ 'BEZ' ],
				initialValues: {
					amount: '123',
					type: '',
					paymentIntervalInMonths: '12',
					isCustomAmount: true,
				},
			};

			action( { commit }, payload );
			expect( commit ).not.toBeCalledWith( 'SET_TYPE' );
		} );

		it( 'commits payment type and set it to valid when payment type is set', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 12 ],
				allowedPaymentTypes: [ 'BEZ' ],
				initialValues: {
					amount: '2399',
					type: 'BEZ',
					paymentIntervalInMonths: '12',
					isCustomAmount: true,
				},
			};

			action( { commit }, payload );
			expect( commit ).toBeCalledWith( 'SET_TYPE', 'BEZ' );
			expect( commit ).toBeCalledWith( 'SET_TYPE_VALIDITY', Validity.VALID );
		} );

		it( 'commits interval', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 12 ],
				allowedPaymentTypes: [ 'BEZ' ],
				initialValues: {
					amount: '2399',
					type: 'BEZ',
					paymentIntervalInMonths: '12',
					isCustomAmount: true,
				},
			};

			action( { commit }, payload );
			expect( commit ).toBeCalledWith( 'SET_INTERVAL', '12' );
		} );

		const paymentAndAmountCases = [
			{ amount: '', type: '', expectedResolution: false },
			{ amount: '0', type: 'BEZ', expectedResolution: false },
			{ amount: '1234', type: '', expectedResolution: false },
			{ amount: '4200', type: 'PPL', expectedResolution: true },
			{ amount: '10000000', type: 'PPL', expectedResolution: false },
		];

		describe.each( paymentAndAmountCases )( 'with initial payment data', ( data: any ) => {
			it( `whose amount is ${ data.amount } and type is ${ data.type } should be ${ data.expectedResolution }`, () => {
				const commit = jest.fn();
				const action = actions.initializePayment as any;
				const payload: PaymentInitialisationPayload = {
					allowedIntervals: [ 0, 12 ],
					allowedPaymentTypes: [ 'BEZ', 'PPL' ],
					initialValues: {
						amount: data.amount,
						type: data.type,
						paymentIntervalInMonths: '0',
						isCustomAmount: false,
					},
				};

				expect.assertions( 1 );
				return expect( action( { commit }, payload ) ).resolves.toBe( data.expectedResolution );
			} );
		} );

		it( 'does not initialise Sofort payment type if initialised with an interval', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 0, 12 ],
				allowedPaymentTypes: [ PaymentType.SOFORT ],
				initialValues: {
					amount: '2399',
					type: PaymentType.SOFORT,
					paymentIntervalInMonths: '12',
					isCustomAmount: false,
				},
			};

			action( { commit }, payload );
			expect( commit ).not.toBeCalledWith( 'SET_TYPE' );
		} );

		it( 'initialises Sofort payment type if interval is 0', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 0, 12 ],
				allowedPaymentTypes: [ PaymentType.SOFORT ],
				initialValues: {
					amount: '2399',
					type: PaymentType.SOFORT,
					paymentIntervalInMonths: '0',
					isCustomAmount: false,
				},
			};

			action( { commit }, payload );
			expect( commit ).toBeCalledWith( 'SET_TYPE', PaymentType.SOFORT );
		} );

		it( 'initialises Sofort payment type if interval is emtpy', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 0, 12 ],
				allowedPaymentTypes: [ PaymentType.SOFORT ],
				initialValues: {
					amount: '2399',
					type: PaymentType.SOFORT,
					paymentIntervalInMonths: '',
					isCustomAmount: false,
				},
			};

			action( { commit }, payload );
			expect( commit ).toBeCalledWith( 'SET_TYPE', PaymentType.SOFORT );
		} );

		it( 'does not initialise payment type if it is not in allowed list', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 0, 12 ],
				allowedPaymentTypes: [ PaymentType.PAYPAL ],
				initialValues: {
					amount: '2399',
					type: PaymentType.DIRECT_DEBIT,
					paymentIntervalInMonths: '0',
					isCustomAmount: false,
				},
			};

			action( { commit }, payload );
			expect( commit ).not.toBeCalledWith( 'SET_TYPE', PaymentType.DIRECT_DEBIT );
		} );

		it( 'does not initialise interval if it is not in allowed list', () => {
			const commit = jest.fn();
			const action = actions.initializePayment as any;
			const payload: PaymentInitialisationPayload = {
				allowedIntervals: [ 0, 12 ],
				allowedPaymentTypes: [ PaymentType.PAYPAL ],
				initialValues: {
					amount: '2399',
					type: PaymentType.DIRECT_DEBIT,
					paymentIntervalInMonths: '42',
					isCustomAmount: false,
				},
			};

			action( { commit }, payload );
			expect( commit ).not.toBeCalledWith( 'SET_INTERVAL', PaymentType.DIRECT_DEBIT );
		} );
	} );

	describe( 'Actions/markEmptyAmountAsInvalid', () => {
		it( 'commits to mutation [MARK_EMPTY_AMOUNT_INVALID]', () => {
			const commit = jest.fn();
			const action = actions.markEmptyAmountAsInvalid as any;
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

		const newMockActionContext = (): ActionContext<DonationPayment, any> => ( {
			commit: jest.fn(),
			dispatch: jest.fn(),
			getters: undefined,
			rootGetters: undefined,
			rootState: undefined,
			state: {
				initialized: true,
				isValidating: false,
				validity: {},
				values: {},
			},
		} );

		it( 'commits to mutation [SET_AMOUNT]', () => {
			const context = newMockActionContext();
			const payload = '2500';
			actions.setAmount( context, '2500' );

			expect( context.commit ).toHaveBeenCalledWith( 'SET_AMOUNT', payload );
		} );

		it( 'commits to mutation [SET_AMOUNT_VALIDITY] on successful validation', () => {
			const context = newMockActionContext();

			actions.setAmount( context, '2500' );

			expect( context.commit ).toHaveBeenCalledWith( 'SET_AMOUNT_VALIDITY', Validity.VALID );
		} );

		it( 'commits to mutation [SET_AMOUNT_VALIDITY] on failed validation', () => {
			const context = newMockActionContext();

			actions.setAmount( context, '999999999999' );

			expect( context.commit ).toHaveBeenCalledWith( 'SET_AMOUNT_VALIDITY', Validity.INVALID );
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
