import { getters } from '@src/store/address/getters';
import { actions } from '@src/store/address/actions';
import { mutations } from '@src/store/address/mutations';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import type { AddressState } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { REQUIRED_FIELDS } from '@src/store/address/constants';
import mockAxios from 'jest-mock-axios';

function newMinimalStore( overrides: Object ): AddressState {
	return Object.assign(
		{
			serverSideValidationCount: 0,
			addressType: AddressTypeModel.PERSON,
			newsletter: false,
			receipt: false,
			requiredFields: REQUIRED_FIELDS,
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
				addressType: Validity.VALID,
			},
		},
		overrides
	);
}

describe( 'Address', () => {

	describe( 'Getters/invalidFields', () => {
		const requiredFields = REQUIRED_FIELDS[ AddressTypeModel.PERSON ];

		it( 'does not return non-required fields as invalid when they are not set', () => {
			const expectedInvalidFields = requiredFields.filter( e => e !== 'addressType' );
			expect( getters.invalidFields(
				newMinimalStore( {
					addressType: AddressTypeModel.PERSON,
					validity: {
						addressType: Validity.VALID,
						salutation: Validity.INVALID,
						title: Validity.INVALID,
						firstName: Validity.INVALID,
						lastName: Validity.INVALID,
						street: Validity.INVALID,
						postcode: Validity.INVALID,
						city: Validity.INVALID,
						country: Validity.INVALID,
						email: Validity.INVALID,
					},
				} ),
				null,
				null,
				null
			) ).toStrictEqual( expectedInvalidFields );
		} );

		it( 'returns an array of all invalid and incomplete fields', () => {
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
			) ).toStrictEqual( [ 'street', 'postcode' ] );
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

	describe( 'Getters/addressTypeIsNotAnon', () => {

		it( 'returns true for address types person and company', () => {
			const addressType: AddressTypeModel = AddressTypeModel.COMPANY;
			expect( getters.addressTypeIsNotAnon(
				newMinimalStore( {
					addressType: AddressTypeModel.COMPANY,
				} ),
				{ addressType },
				null,
				null
			) ).toBe( true );
		} );

		it( 'returns false for anon users', () => {
			const addressType: AddressTypeModel = AddressTypeModel.ANON;
			expect( getters.addressTypeIsNotAnon(
				newMinimalStore( {
					addressType: AddressTypeModel.ANON,
				} ),
				{ addressType },
				null,
				null
			) ).toBe( false );
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

	describe( 'Getters/willGetReceipt', () => {
		it( 'will return true when non anonymous user demands receipt', () => {
			expect( getters.willGetReceipt(
				newMinimalStore( {
					receipt: true,
				} ),
				{ addressTypeIsNeitherAnonNorEmail: true },
				null,
				null
			) ).toBe( true );
		} );

		it( 'will return false for anonymous users', () => {
			expect( getters.willGetReceipt(
				newMinimalStore( {
					receipt: false,
				} ),
				{ addressTypeIsNeitherAnonNorEmail: false },
				null,
				null
			) ).toBe( false );

			expect( getters.willGetReceipt(
				newMinimalStore( {
					receipt: true,
				} ),
				{ addressTypeIsNeitherAnonNorEmail: false },
				null,
				null
			) ).toBe( false );
		} );

		it( 'will return false when non anonymous user declines receipt', () => {
			expect( getters.willGetReceipt(
				newMinimalStore( {
					receipt: false,
				} ),
				{ addressTypeIsNeitherAnonNorEmail: true },
				null,
				null
			) ).toBe( false );
		} );
	} );

	describe( 'Getters/willGetNewsletter', () => {
		it( 'will return true when non anonymous user demands newsletter', () => {
			expect( getters.willGetNewsletter(
				newMinimalStore( {
					newsletter: true,
				} ),
				{ addressTypeIsNotAnon: true },
				null,
				null
			) ).toBe( true );
		} );

		it( 'will return false when non anonymous user declines newsletter', () => {
			expect( getters.willGetNewsletter(
				newMinimalStore( {
					newsletter: false,
				} ),
				{ addressTypeIsNotAnon: true },
				null,
				null
			) ).toBe( false );
		} );

		it( 'will return false for anonymous users', () => {
			expect( getters.willGetNewsletter(
				newMinimalStore( {
					newsletter: true,
				} ),
				{ addressTypeIsNotAnon: false },
				null,
				null
			) ).toBe( false );

			expect( getters.willGetNewsletter(
				newMinimalStore( {
					newsletter: false,
				} ),
				{ addressTypeIsNotAnon: false },
				null,
				null
			) ).toBe( false );
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

	describe( 'Actions/setAddressType', () => {
		it( 'commits to mutation [SET_ADDRESS_TYPE] with the chosen type', () => {
			const commit = jest.fn(),
				action = actions.setAddressType as any,
				type = AddressTypeModel.COMPANY;
			action( { commit, getters }, type );
			expect( commit ).toBeCalledWith(
				'SET_ADDRESS_TYPE',
				type
			);
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

	describe( 'Actions/setNewsletterChoice', () => {
		it( 'commits to mutation [SET_NEWSLETTER] with the entered choice', () => {
			const commit = jest.fn(),
				action = actions.setNewsletterChoice as any,
				choice = true;
			action( { commit }, choice );
			expect( commit ).toBeCalledWith(
				'SET_NEWSLETTER',
				choice
			);
		} );
	} );

	describe( 'Actions/adjustSalutationLocale', () => {
		it( 'does not adjust when salutation is empty', () => {
			const commit = jest.fn();
			const action = actions.adjustSalutationLocale as any;
			const salutations = [ { value: 'Mr' }, { value: 'Ms' } ];

			action( { commit }, { salutations, salutation: '' } );

			expect( commit ).not.toHaveBeenCalled();
		} );

		it( 'adjusts the salutation when it finds it in the server salutations array', () => {
			const commit = jest.fn();
			const action = actions.adjustSalutationLocale as any;
			const salutations = [ { value: 'Mr' }, { value: 'Ms' } ];

			action( { commit }, { salutations, salutation: 'Mr' } );

			expect( commit ).toHaveBeenCalledWith(
				'SET_SALUTATION',
				'Mr'
			);
		} );

		it( 'adjusts the salutation when it finds it in the local translations array', () => {
			const commit = jest.fn();
			const action = actions.adjustSalutationLocale as any;
			const salutations = [ { value: 'Mr' }, { value: 'Ms' } ];

			action( { commit }, { salutations, salutation: 'No Salutation' } );

			expect( commit ).toHaveBeenCalledWith(
				'SET_SALUTATION',
				'Keine Anrede'
			);
		} );
	} );

	describe( 'Mutations/VALIDATE_INPUT', () => {
		it( 'sets validity to valid for optional unfilled fields', () => {
			const inputField = {
					name: 'title',
					value: '',
					pattern: '',
					optionalField: true,
				},
				store = newMinimalStore( {} );
			mutations.VALIDATE_INPUT( store, inputField );
			expect( store.validity.title ).toStrictEqual( Validity.VALID );
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

	describe( 'Mutations/MARK_EMPTY_FIELDS_INVALID', () => {
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
		it( 'increases validation counter', () => {
			const store = newMinimalStore( {} );
			mutations.BEGIN_EMAIL_VALIDATION( store, null );
			expect( store.serverSideValidationCount ).toBe( 1 );
		} );
	} );

	describe( 'Mutations/FINISH_EMAIL_VALIDATION', () => {
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
		it( 'sets receipt opt out choice', () => {
			const store = newMinimalStore( {} );
			const choice = true;
			mutations.SET_RECEIPT( store, choice );
			expect( store.receipt ).toBe( choice );
		} );
	} );

	describe( 'Mutations/SET_NEWSLETTER', () => {
		it( 'sets receipt opt out choice', () => {
			const store = newMinimalStore( {} );
			const choice = true;
			mutations.SET_NEWSLETTER( store, choice );
			expect( store.newsletter ).toBe( choice );
		} );
	} );

} );
