import { getters } from '@src/store/membership_fee/getters';
import { actions } from '@src/store/membership_fee/actions';
import { mutations } from '@src/store/membership_fee/mutations';
import { GenericValuePayload,  MembershipFee } from '@src/view_models/MembershipFee';
import { Validity } from '@src/view_models/Validity';
import { markEmptyFeeAsInvalid, validateFee } from '@src/store/membership_fee/actionTypes';
import { MARK_EMPTY_FEE_INVALID, SET_FEE, SET_FEE_VALIDITY, SET_INTERVAL, SET_INTERVAL_VALIDITY } from '@src/store/membership_fee/mutationTypes';
import each from 'jest-each';
import mockAxios from 'jest-mock-axios';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

function newMinimalStore( overrides: Object ): MembershipFee {
	return Object.assign(
		{
			isValidating: false,
			validity: {
				fee: Validity.INCOMPLETE,
				type: Validity.INCOMPLETE,
			},
			values: {
				fee: '',
				interval: '',
				type: 'BEZ',
			},
		},
		overrides
	);
}

describe( 'MembershipFee', () => {

	const validityCases = [
		[ Validity.VALID, true ],
		[ Validity.INVALID, false ],
		[ Validity.INCOMPLETE, true ],
	];

	describe( 'Getters/feeIsValid', () => {
		it( 'does not return invalid fee on initalization', () => {
			expect( getters.feeIsValid(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( true );
		} );

		each( validityCases ).it( 'converts validity types to boolean state (test index %#)',
			( feeValidity, isValid ) => {
				const state = {
					validity: {
						fee: feeValidity,
						type: Validity.INCOMPLETE,
					},
				};
				expect( getters.feeIsValid(
					newMinimalStore( state ),
					null,
					null,
					null
				) ).toBe( isValid );
			},
		);
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
						fee: Validity.INCOMPLETE,
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

	describe( 'Getters/allPaymentValuesAreSet', () => {
		each( [ 'fee', 'interval', 'type' ] )
			.it( 'returns false if a field is not filled (test index %#)', ( unfilledField: 'fee' | 'interval' | 'type' ) => {
				const state = {
					values: {
						fee: '2000',
						interval: '6',
						type: 'BEZ',
					},
				};
				state.values[ unfilledField ] = '';
				expect( getters.allPaymentValuesAreSet(
					newMinimalStore( state ),
					null,
					null,
					null
				) ).toBe( false );
			} );

		it( 'returns true if all field are filled', () => {
			const state = {
				values: {
					fee: '2000',
					interval: '6',
					type: 'BEZ',
				},
			};
			expect( getters.allPaymentValuesAreSet(
				newMinimalStore( state ),
				null,
				null,
				null
			) ).toBe( true );
		} );
	} );

	describe( 'Actions/markEmptyFeeAsInvalid', () => {
		it( 'commits to mutation [MARK_EMPTY_FEE_INVALID]', () => {
			const commit = jest.fn();
			const action = actions[ markEmptyFeeAsInvalid ] as any;
			action( { commit } );
			expect( commit ).toBeCalledWith(
				MARK_EMPTY_FEE_INVALID
			);
		} );
	} );

	describe( 'Actions/markEmptyValuesAsInvalid', () => {
		it( 'commits to mutation [MARK_EMPTY_FIELDS_INVALID]', () => {
			const context = {
				commit: jest.fn(),
				getters: {
					'membership_fee/paymentDataIsValid': true,
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
		it( 'stores interval [SET_INTERVAL] and validates with [SET_INTERVAL_VALIDITY]', () => {
			const context = {
				commit: jest.fn(),
				state: {
					values: {
						fee: '',
					},
				},
				getters: {
					allPaymentValuesAreSet: false,
				},
			};
			const action = actions.setInterval as any;
			action( context, { selectedValue: '3', validateFeeUrl: '' } as GenericValuePayload );
			expect( context.commit ).toHaveBeenNthCalledWith(
				1,
				SET_INTERVAL,
				'3'
			);
			expect( context.commit ).toHaveBeenNthCalledWith(
				2,
				SET_INTERVAL_VALIDITY,
			);
		} );

		it( 'triggers server-side-validation when all values are set', () => {
			const context = {
					commit: jest.fn(),
					dispatch: jest.fn( () => Promise.resolve() ),
					state: {
						values: {
							fee: '2000',
							interval: '6',
							type: 'BEZ',
						},
					},
					getters: {
						allPaymentValuesAreSet: true,
					},
					rootState: {
						membership_address: { // eslint-disable-line camelcase
							addressType: AddressTypeModel.PERSON,
						},
					},
				},
				expectedPayload :GenericValuePayload = {
					selectedValue: '2000',
					validateFeeUrl: '/validate-fee-url',
				};

			const action = actions.setInterval as any;
			return action( context, { selectedValue: '3', validateFeeUrl: '/validate-fee-url' } as GenericValuePayload ).then( () => {
				expect( context.dispatch ).toHaveBeenCalledWith( validateFee, expectedPayload );
			} );
		} );
	} );

	describe( 'Actions/setFee', () => {

		it( 'stores fee with [SET_FEE]]', () => {
			const context = {
					commit: jest.fn(),
					dispatch: jest.fn().mockResolvedValue( null ),
					state: {
						values: {
							interval: 12,
						},
					},
					getters: {
						allPaymentValuesAreSet: false,
					},
					rootState: {
						membership_address: { // eslint-disable-line camelcase
							addressType: AddressTypeModel.PERSON,
						},
					},
				},
				payload = {
					selectedValue: '2500',
					validateFeeUrl: '/validation-fee-url',
				} as GenericValuePayload;
			const action = actions.setFee as any;
			return action( context, payload ).then( function () {
				expect( context.commit ).toHaveBeenCalledWith( SET_FEE, payload.selectedValue );
			} );
		} );

		it( 'calls validation action with payload when interval and fee look ok', () => {
			const context = {
					commit: jest.fn(),
					dispatch: jest.fn().mockResolvedValue( null ),
					state: {
						values: {
							interval: 12,
						},
					},
					getters: {
						allPaymentValuesAreSet: true,
					},
					rootState: {
						membership_address: { // eslint-disable-line camelcase
							addressType: AddressTypeModel.PERSON,
						},
					},
				},
				payload = {
					feeValue: '2500',
					validateFeeUrl: '/validation-fee-url',
				};
			const action = actions.setFee as any;
			action( context, payload ).then( function () {
				expect( context.dispatch ).toHaveBeenCalledWith( 'validateFee', payload );
			} );
		} );

		it( 'commits INVALID validity if a non-numeric fee is supplied', () => {
			const context = {
					commit: jest.fn(),
					dispatch: jest.fn().mockResolvedValue( null ),
					state: {
						values: {
							interval: 12,
						},
					},
					getters: {
						allPaymentValuesAreSet: false,
					},
					rootState: {
						membership_address: { // eslint-disable-line camelcase
							addressType: AddressTypeModel.PERSON,
						},
					},
				},
				payload = {
					selectedValue: '2500Blah',
					validateFeeUrl: '/validation-fee-url',
				};
			const action = actions.setFee as any;
			return action( context, payload ).then( () => {
				expect( context.commit ).toHaveBeenCalledWith(
					SET_FEE_VALIDITY,
					Validity.INVALID
				);
				expect( context.dispatch ).not.toBeCalled();
			} );
		} );
	} );

	describe( 'Actions/validateFee', () => {

		afterEach( function () {
			mockAxios.reset();
		} );

		it( 'sends a post request for fee validation', () => {
			const context = {
					commit: jest.fn(),
					state: {
						values: {
							interval: 12,
						},
					},
					rootState: {
						membership_address: { // eslint-disable-line camelcase
							addressType: AddressTypeModel.PERSON,
						},
					},
				},
				payload = {
					selectedValue: '2500',
					validateFeeUrl: '/validation-fee-url',
				},
				expectedFormData = new FormData();
			expectedFormData.append( 'membershipFee', '2500' );
			expectedFormData.append( 'paymentIntervalInMonths', '12' );
			expectedFormData.append( 'addressType', 'person' );
			const action = actions.validateFee as any;
			action( context, payload ).then( function () {
				expect( mockAxios.post ).toHaveBeenCalledWith( payload.validateFeeUrl, expectedFormData );
			} );
		} );

		it( 'commits to mutation [SET_FEE_VALIDITY] after server side request', () => {
			const context = {
					commit: jest.fn(),
					state: {
						values: {
							interval: 12,
						},
					},
					rootState: {
						membership_address: { // eslint-disable-line camelcase
							addressType: AddressTypeModel.PERSON,
						},
					},
				},
				payload = {
					selectedValue: '2500',
					validateFeeUrl: '/validation-fee-url',
				},
				action = actions.validateFee as any;

			const actionResult = action( context, payload ).then( function () {
				expect( context.commit ).toHaveBeenCalledWith( 'SET_FEE_VALIDITY', Validity.VALID );
			} );

			mockAxios.mockResponse( {
				status: 200,
				data: {
					'status': 'OK',
				},
			} );

			return actionResult;
		} );

		it( 'commits to mutation [SET_IS_VALIDATING] when doing server side validation', () => {
			const context = {
					commit: jest.fn(),
					state: {
						values: {
							interval: 12,
						},
					},
					rootState: {
						membership_address: { // eslint-disable-line camelcase
							addressType: AddressTypeModel.PERSON,
						},
					},
				},
				payload = {
					selectedValue: '2500',
					validateFeeUrl: '/validation-fee-url',
				},
				action = actions.validateFee as any;

			const actionResult = action( context, payload ).then( function () {
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

	describe( 'Mutations/MARK_EMPTY_FEE_INVALID', () => {
		const feeStates = [
			[ { values: { fee: '1' } }, Validity.VALID ],
			[ { values: { fee: '' } }, Validity.INVALID ],
			[ { values: { fee: '0' } }, Validity.INVALID ],
			[ { values: { fee: 'hello' } }, Validity.INVALID ],
		];

		each( feeStates ).it(
			'mutates the state with the correct validity for a given fee (test index %#)',
			( feeState, expectedValidity ) => {
				const store = newMinimalStore( feeState );
				mutations.MARK_EMPTY_FEE_INVALID( store, {} );
				expect( store.validity.fee ).toStrictEqual( expectedValidity );
			} );
	} );

	describe( 'Mutations/SET_FEE_VALIDITY', () => {
		it( 'mutates the fee validity', () => {
			const store = newMinimalStore( {} );
			mutations.SET_FEE_VALIDITY( store, Validity.VALID );
			expect( store.validity.fee ).toStrictEqual( Validity.VALID );
			mutations.SET_FEE_VALIDITY( store, Validity.INVALID );
			expect( store.validity.fee ).toStrictEqual( Validity.INVALID );
		} );

		it( 'sets fee to empty when it is invalid', () => {
			const store = newMinimalStore( { values: { fee: '500' } } );
			mutations.SET_FEE_VALIDITY( store, Validity.INVALID );
			expect( store.values.fee ).toStrictEqual( '' );
		} );

		it( 'leaves fee as-is for other validity values', () => {
			const store = newMinimalStore( { values: { fee: '500' } } );
			mutations.SET_FEE_VALIDITY( store, Validity.VALID );
			expect( store.values.fee ).toStrictEqual( '500' );
			mutations.SET_FEE_VALIDITY( store, Validity.INCOMPLETE );
			expect( store.values.fee ).toStrictEqual( '500' );
			mutations.SET_FEE_VALIDITY( store, Validity.RESTORED );
			expect( store.values.fee ).toStrictEqual( '500' );
		} );
	} );

	describe( 'Mutations/SET_FEE', () => {
		it( 'mutates the fee', () => {
			const store = newMinimalStore( {} );
			mutations.SET_FEE( store, '2500' );
			expect( store.values.fee ).toStrictEqual( '2500' );
			mutations.SET_FEE( store, '100' );
			expect( store.values.fee ).toStrictEqual( '100' );
		} );

		it( 'cuts off cent amounts', () => {
			const store = newMinimalStore( {} );
			mutations.SET_FEE( store, '2599' );
			expect( store.values.fee ).toStrictEqual( '2500' );
			mutations.SET_FEE( store, '5555' );
			expect( store.values.fee ).toStrictEqual( '5500' );
			mutations.SET_FEE( store, '99' );
			expect( store.values.fee ).toStrictEqual( '0' );
			mutations.SET_FEE( store, '' );
			expect( store.values.fee ).toStrictEqual( '' );
			mutations.SET_FEE( store, '0' );
			expect( store.values.fee ).toStrictEqual( '' );
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

	describe( 'Mutations/SET_IS_VALIDATING', () => {
		it( 'mutates validation state', () => {
			const store = newMinimalStore( {} );
			mutations.SET_IS_VALIDATING( store, true );
			expect( store.isValidating ).toStrictEqual( true );
			mutations.SET_IS_VALIDATING( store, false );
			expect( store.isValidating ).toStrictEqual( false );
		} );
	} );
} );
