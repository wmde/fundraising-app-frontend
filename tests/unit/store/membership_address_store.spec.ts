import { getters } from '@/store/membership_address/getters';
import { actions } from '@/store/membership_address/actions';
import { mutations } from '@/store/membership_address/mutations';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@/view_models/MembershipTypeModel';
import { MembershipAddressState } from '@/view_models/Address';
import { Validity } from '@/view_models/Validity';
import { REQUIRED_FIELDS } from '@/store/membership_address/constants';
import mockAxios from 'jest-mock-axios';
import { NS_MEMBERSHIP_FEE } from '../../../src/store/namespaces';

function newMinimalStore( overrides: Object ): MembershipAddressState {
	return Object.assign(
		{
			serverSideValidationCount: 0,
			addressType: AddressTypeModel.PERSON,
			membershipType: MembershipTypeModel.SUSTAINING,
			receipt: false,
			incentives: [],
			values: {
				salutation: '',
				title: '',
				firstName: '',
				lastName: '',
				companyName: '',
				street: '',
				postcode: '',
				city: '',
				country: 'DE',
				email: '',
				date: '',
			},
			validity: {
				salutation: Validity.INCOMPLETE,
				title: Validity.INCOMPLETE,
				firstName: Validity.INCOMPLETE,
				lastName: Validity.INCOMPLETE,
				companyName: Validity.INCOMPLETE,
				street: Validity.INCOMPLETE,
				postcode: Validity.INCOMPLETE,
				city: Validity.INCOMPLETE,
				country: Validity.VALID,
				email: Validity.INCOMPLETE,
				date: Validity.VALID,
				addressType: Validity.VALID,
				membershipType: Validity.VALID,
			},
		},
		overrides
	);
}

describe( 'MembershipAddress', () => {

	describe( 'Getters/invalidFields', () => {
		const requiredFields = REQUIRED_FIELDS[ AddressTypeModel.PERSON ];

		it( 'does not return non-required fields as invalid when they are not set', () => {
			expect( getters.invalidFields(
				newMinimalStore( {
					addressType: AddressTypeModel.PERSON,
					validity: {
						addressType: Validity.INCOMPLETE,
					},
				} ),
				null,
				null,
				null
			) ).toStrictEqual( requiredFields );
		} );

		it( 'returns an array of all invalid and incomplete fields', () => {
			// remove email and city because they are VALID
			var expectedInvalidFields = requiredFields.filter( e => e !== 'email' && e !== 'city' );
			expect( getters.invalidFields(
				newMinimalStore( {
					validity: {
						street: Validity.INVALID,
						postcode: Validity.INVALID,
						email: Validity.VALID,
						city: Validity.VALID,
					},
				} ),
				getters,
				null,
				null
			) ).toStrictEqual( expectedInvalidFields );
		} );
	} );

	describe( 'Getters/requiredFieldsAreValid', () => {

		it( 'returns true when all required fields are correctly filled', () => {
			const invalidFields: Array<String> = [];
			expect( getters.requiredFieldsAreValid(
				newMinimalStore( {} ),
				{ invalidFields },
				null,
				null
			) ).toBe( true );
		} );

		it( 'returns false if there are wrongly filled required fields', () => {
			const invalidFields: Array<String> = [ 'street', 'postcode' ];
			expect( getters.requiredFieldsAreValid(
				newMinimalStore( {} ),
				{ invalidFields },
				null,
				null
			) ).toBe( false );
		} );
	} );

	describe( 'Getters/membershipTypeIsValid', () => {

		it( 'returns true when validity is valid (default)', () => {
			expect( getters.membershipTypeIsValid( newMinimalStore( {} ), null, null, null ) ).toBe( true );
		} );

		it( 'returns false when validity is incomplete or invalid', () => {
			expect( getters.membershipTypeIsValid(
				newMinimalStore( { validity: { membershipType: Validity.INCOMPLETE } } ),
				null,
				null,
				null
			) ).toBe( false );

			expect( getters.membershipTypeIsValid(
				newMinimalStore( { validity: { membershipType: Validity.INVALID } } ),
				null,
				null,
				null
			) ).toBe( false );
		} );
	} );

	describe( 'Getters/addressType', () => {

		it( 'returns address type from the store', () => {
			expect( getters.addressType(
				newMinimalStore( {
					addressType: AddressTypeModel.COMPANY,
				} ),
				null,
				null,
				null
			) ).toBe( AddressTypeModel.COMPANY );
		} );
	} );

	describe( 'Getters/isPerson', () => {

		it( 'returns true for private persons', () => {
			expect( getters.isPerson(
				newMinimalStore( {} ),
				null,
				null,
				null
			) ).toBe( true );
		} );

		it( 'returns false for private persons', () => {
			expect( getters.isPerson(
				newMinimalStore( { addressType: AddressTypeModel.COMPANY } ),
				null,
				null,
				null
			) ).toBe( false );
		} );
	} );

	describe( 'Getters/membershipType', () => {

		it( 'returns membership type from the store', () => {
			expect( getters.membershipType(
				newMinimalStore( {
					membershipType: MembershipTypeModel.ACTIVE,
				} ),
				null,
				null,
				null
			) ).toBe( MembershipTypeModel.ACTIVE );
		} );
	} );

	describe( 'Getters/fullName', () => {

		it( 'returns company name when address type is company', () => {
			expect( getters.fullName(
				newMinimalStore( {
					addressType: AddressTypeModel.COMPANY,
					values: {
						companyName: 'Testmedia Deutschland',
					},
				} ),
				null,
				null,
				null
			) ).toBe( 'Testmedia Deutschland' );
		} );

		it( 'returns full name and title when address type is person', () => {
			expect( getters.fullName(
				newMinimalStore( {
					addressType: AddressTypeModel.PERSON,
					values: {
						firstName: 'Testina',
						lastName: 'Testingson',
						title: 'Prof. Dr.',
					},
				} ),
				null,
				null,
				null
			) ).toBe( 'Prof. Dr. Testina Testingson' );
		} );

		it( 'returns only first and last name when title is not chosen', () => {
			expect( getters.fullName(
				newMinimalStore( {
					addressType: AddressTypeModel.PERSON,
					values: {
						firstName: 'Testina',
						lastName: 'Testingson',
						title: '',
					},
				} ),
				null,
				null,
				null
			) ).toBe( 'Testina Testingson' );
		} );
	} );

	describe( 'Actions/setAddressField', () => {
		it( 'commits to mutation [SET_ADDRESS_FIELD] and [VALIDATE_INPUT] with the correct field', () => {
			const commit = jest.fn(),
				action = actions.setAddressField as any,
				field = {
					name: 'postcode',
					value: '',
					pattern: '^[0-9]{4,5}$',
					optionalField: false,
				};
			action( { commit }, field );
			expect( commit ).toBeCalledWith(
				'SET_ADDRESS_FIELD',
				field
			);
			expect( commit ).toBeCalledWith(
				'VALIDATE_INPUT',
				field
			);
		} );

		it( 'trims values before it commits to mutation', () => {
			const commit = jest.fn(),
				action = actions.setAddressField as any,
				field = {
					name: 'postcode',
					value: '     12345      ',
					pattern: '^[0-9]{4,5}$',
					optionalField: false,
				},
				trimmedField = {
					name: 'postcode',
					value: '12345',
					pattern: '^[0-9]{4,5}$',
					optionalField: false,
				};
			action( { commit }, field );
			expect( commit ).toBeCalledWith(
				'SET_ADDRESS_FIELD',
				trimmedField
			);
			expect( commit ).toBeCalledWith(
				'VALIDATE_INPUT',
				trimmedField
			);
		} );
	} );

	describe( 'Actions/validateAddress', () => {
		afterEach( function () {
			mockAxios.reset();
		} );
		it( 'commits to mutation [MARK_EMPTY_FIELDS_INVALID] and [BEGIN_ADDRESS_VALIDATION]', () => {
			const context = {
					commit: jest.fn(),
					getters: {
						requiredFieldsAreValid: true,
					},
					state: newMinimalStore( {
						addressType: AddressTypeModel.PERSON,
						values: {
							salutation: 'Mrs',
							title: 'Pro. Dr.',
							firstName: 'Testina',
							lastName: 'Testington',
							street: 'Testenhofen Ufer 23-24',
							postcode: '12345',
							city: 'Testlin',
							country: 'DE',
							email: 'test@testmedia.de',
							date: '01.01.1942',
						},
					} ),
				},
				validationUrl = '/check-address',
				action = actions.validateAddress as any;
			action( context, validationUrl );
			expect( context.commit ).toBeCalledWith(
				'MARK_EMPTY_FIELDS_INVALID'
			);
			expect( context.commit ).toBeCalledWith(
				'BEGIN_ADDRESS_VALIDATION'
			);
		} );

		it( 'sends post request for validation when required fields are valid and commits to mutation [FINISH_ADDRESS_VALIDATION]', () => {
			const context = {
					commit: jest.fn(),
					getters: {
						requiredFieldsAreValid: true,
					},
					state: newMinimalStore( {
						addressType: AddressTypeModel.PERSON,
						values: {
							salutation: 'Mrs',
							title: 'Pro. Dr.',
							firstName: 'Testina',
							lastName: 'Testington',
							street: 'Testenhofen Ufer 23-24',
							postcode: '12345',
							city: 'Testlin',
							country: 'DE',
							email: 'test@testmedia.de',
							date: '01.01.1942',
						},
					} ),
				},
				validationUrl = '/check-address',
				action = actions.validateAddress as any;

			const actionResult = action( context, validationUrl ).then( function () {
				expect( context.commit ).toHaveBeenCalledWith( 'FINISH_ADDRESS_VALIDATION', {
					status: 'OK',
				} );
			} );

			mockAxios.mockResponse( {
				status: 200,
				data: {
					status: 'OK',
				} as any,
			} );

			return actionResult;
		} );

		it( 'does not send a post request when required fields are invalid and returns an error', () => {
			const context = {
					commit: jest.fn(),
					getters: {
						requiredFieldsAreValid: false,
					},
					state: newMinimalStore( {
						addressType: AddressTypeModel.PERSON,
						values: {
							salutation: '',
							title: '',
							firstName: '',
							lastName: '',
							street: '',
							postcode: 'I AM DEFINITELY INVALID',
							city: '',
							country: '',
							email: '',
							date: '',
						},
					} ),
				},
				validationUrl = '/check-address',
				action = actions.validateAddress as any;
			const actionResult = action( context, validationUrl ).then( function ( resp: any ) {
				expect( resp ).toStrictEqual( { status: 'ERR', messages: [] } );
			} );
			return actionResult;
		} );
	} );

	describe( 'Actions/validateDateOfBirth', () => {
		it( 'returns result if client-side validity is valid', async () => {
			const context = {
					commit: jest.fn(),
					state: newMinimalStore( {
						validity: {
							date: Validity.VALID,
						},
					} ),
				},
				action = actions.validateDateOfBirth as any;
			const result = await action( context );
			expect( result ).toEqual( { status: 'OK', messages: {} } );
			expect( context.commit ).not.toHaveBeenCalled();
		} );

		it( 'returns result if client-side validity is invalid', async () => {
			const context = {
					commit: jest.fn(),
					state: newMinimalStore( {
						validity: {
							date: Validity.INVALID,
						},
					} ),
				},
				action = actions.validateDateOfBirth as any;
			const result = await action( context );
			expect( result ).toEqual( { status: 'ERR', messages: {} } );
			expect( context.commit ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'Actions/setAddressType', () => {
		it( 'commits to mutation [SET_ADDRESS_TYPE] with the chosen type', () => {
			const commit = jest.fn(),
				dispatch = jest.fn(),
				action = actions.setAddressType as any,
				type = AddressTypeModel.COMPANY;
			action( { commit, dispatch, getters, rootGetters: { allPaymentValuesAreSet: false } }, type );
			expect( commit ).toBeCalledWith(
				'SET_ADDRESS_TYPE',
				type
			);
		} );
		it( 'commits to mutation [SET_MEMBERSHIP_TYPE_VALIDITY] with invalid when address type is company and membership type is active', () => {
			const context = {
					commit: jest.fn(),
					dispatch: jest.fn(),
					getters: {
						membershipType: MembershipTypeModel.ACTIVE,
					},
					state: newMinimalStore( {
						validity: {
							membershipType: MembershipTypeModel.ACTIVE,
						},
					} ),
					rootGetters: { allPaymentValuesAreSet: false },
				},
				action = actions.setAddressType as any,
				type = AddressTypeModel.COMPANY;
			action( context, type );
			expect( context.commit ).toBeCalledWith(
				'SET_MEMBERSHIP_TYPE_VALIDITY',
				Validity.INVALID
			);
		} );

		it( 'triggers fee reset action', () => {
			const commit = jest.fn(),
				dispatch = jest.fn(),
				action = actions.setAddressType as any,
				type = AddressTypeModel.COMPANY;
			action( { commit, dispatch, getters, rootGetters: { allPaymentValuesAreSet: false } }, type );
			expect( dispatch ).toBeCalledWith(
				'membership_fee/resetFeeForAddressType',
				type,
				{ root: true }
			);
		} );

		it( 'triggers fee validation when payment values are set', () => {
			const context = {
					commit: jest.fn(),
					dispatch: jest.fn().mockImplementation( () => Promise.resolve() ),
					rootGetters: { allPaymentValuesAreSet: true },
					rootState: { [ NS_MEMBERSHIP_FEE ]: { values: { fee: '500' } } },
					state: newMinimalStore( {} ),
					getters: {
						membershipType: MembershipTypeModel.SUSTAINING,
					},
				},
				action = actions.setAddressType as any,
				type = AddressTypeModel.COMPANY;

			return action( context, type ).then( () => {
				expect( context.dispatch.mock.calls.length ).toBe( 2 );
				expect( context.dispatch.mock.lastCall ).toEqual( [
					'membership_fee/validateFee',
					{
						feeValue: '500',
						validateFeeUrl: '/validate-fee',
					},
					{ root: true },
				] );
			} );
		} );
	} );

	describe( 'Actions/setReceiptChoice', () => {
		it( 'commits to mutation [SET_RECEIPT] with the entered choice', () => {
			const commit = jest.fn(),
				action = actions.setReceiptChoice as any,
				choice = true;
			action( { commit }, choice );
			expect( commit ).toBeCalledWith(
				'SET_RECEIPT',
				choice
			);
		} );
	} );

	describe( 'Actions/setIncentive', () => {
		it( 'commits to mutation [SET_INCENTIVES] with the entered choice', () => {
			const commit = jest.fn(),
				action = actions.setIncentives as any,
				choice = [ 'Playstation 5' ];
			action( { commit }, choice );
			expect( commit ).toBeCalledWith(
				'SET_INCENTIVES',
				choice
			);
		} );
	} );

	describe( 'Actions/setMembershipType', () => {
		it( 'commits to mutation [SET_MEMBERSHIP_TYPE] with the chosen membership type and to [SET_MEMBERSHIP_TYPE_VALIDITY]', () => {
			const commit = jest.fn(),
				action = actions.setMembershipType as any,
				choice = MembershipTypeModel.ACTIVE;
			action( { commit }, choice );
			expect( commit ).toBeCalledWith(
				'SET_MEMBERSHIP_TYPE',
				choice
			);
			expect( commit ).toBeCalledWith(
				'SET_MEMBERSHIP_TYPE_VALIDITY',
				Validity.VALID
			);
		} );
	} );

	describe( 'Mutations/VALIDATE_INPUT', () => {
		it( 'sets validity to incomplete for optional unfilled fields', () => {
			const inputField = {
					name: 'title',
					value: '',
					pattern: '',
					optionalField: true,
				},
				store = newMinimalStore( {} );
			mutations.VALIDATE_INPUT( store, inputField );
			expect( store.validity.title ).toStrictEqual( Validity.INCOMPLETE );
		} );

		it( 'sets validity to valid for correctly filled fields', () => {
			const inputField = {
					name: 'firstName',
					value: 'Testina',
					pattern: '^.+$',
					optionalField: false,
				},
				store = newMinimalStore( {} );
			mutations.VALIDATE_INPUT( store, inputField );
			expect( store.validity.firstName ).toStrictEqual( Validity.VALID );
		} );

		it( 'sets validity to invalid for incorrectly filled fields', () => {
			const inputField = {
					name: 'postcode',
					value: '666666',
					pattern: '^[0-9]{4,5}$',
					optionalField: false,
				},
				store = newMinimalStore( {} );
			mutations.VALIDATE_INPUT( store, inputField );
			expect( store.validity.postcode ).toStrictEqual( Validity.INVALID );
		} );
	} );
	describe( 'Mutations/MARK_EMPTY_FIELD_INVALID', () => {
		it( 'sets validity to invalid for empty mandatory fields', () => {
			const fakeFormData = {
					firstName: {
						name: 'firstName',
						value: '',
						pattern: '^.+$',
						optionalField: false,
					},
					lastName: {
						name: 'lastName',
						value: '',
						pattern: '^.+$',
						optionalField: false,
					},
				},
				store = newMinimalStore( {} );
			expect( store.validity.firstName ).toStrictEqual( Validity.INCOMPLETE );
			expect( store.validity.lastName ).toStrictEqual( Validity.INCOMPLETE );
			mutations.MARK_EMPTY_FIELDS_INVALID( store, fakeFormData );
			expect( store.validity.firstName ).toStrictEqual( Validity.INVALID );
			expect( store.validity.lastName ).toStrictEqual( Validity.INVALID );
		} );
	} );

	describe( 'Mutations/BEGIN_ADDRESS_VALIDATION', () => {
		it( 'increases validation counter', () => {
			const store = newMinimalStore( {} );
			mutations.BEGIN_ADDRESS_VALIDATION( store, null );
			expect( store.serverSideValidationCount ).toBe( 1 );
		} );
	} );

	describe( 'Mutations/FINISH_ADDRESS_VALIDATION', () => {
		it( 'sets validation counter to 0 if there are no errors after the server responds', () => {
			const store = newMinimalStore( { serverSideValidationCount: 1 } ),
				resp = {
					status: 'OK',
					messages: {},
				};
			mutations.FINISH_ADDRESS_VALIDATION( store, resp );
			expect( store.serverSideValidationCount ).toBe( 0 );
		} );

		it( 'sets validity to invalid for the appropriate form fields according to the response from the server', () => {
			const store = newMinimalStore( {} ),
				resp = {
					status: 'ERR',
					messages: {
						postcode: 'error',
						street: 'error',
					},
				};
			expect( store.validity.postcode ).toStrictEqual( Validity.INCOMPLETE );
			expect( store.validity.street ).toStrictEqual( Validity.INCOMPLETE );

			mutations.FINISH_ADDRESS_VALIDATION( store, resp );

			expect( store.validity.postcode ).toStrictEqual( Validity.INVALID );
			expect( store.validity.street ).toStrictEqual( Validity.INVALID );
		} );

	} );

	describe( 'Mutations/BEGIN_EMAIL_VALIDATION', () => {
		it( 'increase validation counter', () => {
			const store = newMinimalStore( {} );
			mutations.BEGIN_EMAIL_VALIDATION( store, null );
			expect( store.serverSideValidationCount ).toBe( 1 );
		} );
	} );

	describe( 'Mutations/FINISH_ADDRESS_VALIDATION', () => {
		it( 'sets validation counter to 0 if there are no errors after the server responds', () => {
			const store = newMinimalStore( { serverSideValidationCount: 1 } ),
				resp = {
					status: 'OK',
					messages: {},
				};
			mutations.FINISH_EMAIL_VALIDATION( store, resp );
			expect( store.serverSideValidationCount ).toBe( 0 );
		} );

		it( 'sets validity to invalid for the appropriate form fields according to the response from the server', () => {
			const store = newMinimalStore( {} ),
				resp = {
					status: 'ERR',
					messages: {
						postcode: 'error',
						street: 'error',
					},
				};
			expect( store.validity.email ).toStrictEqual( Validity.INCOMPLETE );

			mutations.FINISH_EMAIL_VALIDATION( store, resp );

			expect( store.validity.email ).toStrictEqual( Validity.INVALID );
		} );

	} );

	describe( 'Mutations/SET_ADDRESS_TYPE', () => {
		it( 'sets address type', () => {
			const store = newMinimalStore( {} );
			mutations.SET_ADDRESS_TYPE( store, AddressTypeModel.COMPANY );
			expect( store.addressType ).toBe( AddressTypeModel.COMPANY );
		} );
	} );

	describe( 'Mutations/SET_ADDRESS_FIELDS', () => {
		it( 'sets address fields values in store', () => {
			const store = newMinimalStore( {} );
			const fields = {
				firstName: {
					name: 'firstName',
					value: 'foo bar',
					pattern: '^.+$',
					optionalField: false,
				},
				lastName: {
					name: 'lastName',
					value: 'should be forbidden',
					pattern: '^.+$',
					optionalField: false,
				},
				street: {
					name: 'street',
					value: 'because it makes no sense',
					pattern: '^.+$',
					optionalField: false,
				},
			};
			mutations.SET_ADDRESS_FIELDS( store, fields );
			expect( store.values.firstName ).toBe( 'foo bar' );
			expect( store.values.lastName ).toBe( 'should be forbidden' );
			expect( store.values.street ).toBe( 'because it makes no sense' );
		} );
	} );

	describe( 'Mutations/SET_ADDRESS_FIELD', () => {
		it( 'sets field value in store', () => {
			const store = newMinimalStore( {} );
			const field = {
				name: 'firstName',
				value: 'Amazing',
				pattern: '^.+$',
				optionalField: false,
			};
			mutations.SET_ADDRESS_FIELD( store, field );
			expect( store.values.firstName ).toBe( 'Amazing' );
		} );
	} );

	describe( 'Mutations/SET_RECEIPT', () => {
		it( 'sets receipt choice', () => {
			const store = newMinimalStore( {} );
			const choice = true;
			mutations.SET_RECEIPT( store, choice );
			expect( store.receipt ).toBe( choice );
		} );
	} );

	describe( 'Mutations/SET_MEMBERSHIP_TYPE', () => {
		it( 'sets membership type choice', () => {
			const store = newMinimalStore( {} );
			const choice = MembershipTypeModel.ACTIVE;
			mutations.SET_MEMBERSHIP_TYPE( store, choice );
			expect( store.membershipType ).toBe( choice );
		} );
	} );

	describe( 'Mutations/SET_MEMBERSHIP_TYPE_VALIDITY', () => {
		it( 'sets membership type validity', () => {
			const store = newMinimalStore( {} );
			const choice = Validity.INVALID;
			mutations.SET_MEMBERSHIP_TYPE_VALIDITY( store, choice );
			expect( store.validity.membershipType ).toBe( choice );
		} );
	} );

} );
