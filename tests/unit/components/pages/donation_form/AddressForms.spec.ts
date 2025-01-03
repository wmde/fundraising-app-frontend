import { mount } from '@vue/test-utils';
import AddressForms from '@src/components/pages/donation_form/AddressForms.vue';
import NameFields from '@src/components/shared/NameFields.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import { createStore, StoreKey } from '@src/store/donation_store';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { action } from '@src/store/util';
import countries from '@src/../tests/data/countries';
import { Validity } from '@src/view_models/Validity';
import { addressValidationPatterns } from '@test/data/validation';
import each from 'jest-each';
import { createFeatureToggle } from '@src/util/createFeatureToggle';

const store = createStore();

export const EXAMPLE_SALUTATIONS = [
	{
		label: 'Mr',
		value: 'Herr',
		display: 'Herr',
		greetings: {
			formal: '',
			informal: '',
			lastNameInformal: '',
		},
	},
	{
		label: 'Ms',
		value: 'Frau',
		display: 'Frau',
		greetings: {
			formal: '',
			informal: '',
			lastNameInformal: '',
		},
	},
	{
		label: 'No Salutation',
		value: 'Divers',
		display: 'Divers',
		greetings: {
			formal: '',
			informal: '',
			lastNameInformal: '',
		},
	},
];

describe( 'AddressForms.vue', () => {

	let originalStoreDispatch: any;

	const createOptionsForAddressType = ( addressType: AddressTypeModel ) => ( {
		props: {
			countries: countries,
			addressValidationPatterns: addressValidationPatterns,
			addressType,
			trackingData: {
				bannerImpressionCount: 1,
				impressionCount: 5,
			},
			campaignValues: {
				campaign: 'nicholas',
				keyword: 'cage',
			},
			salutations: EXAMPLE_SALUTATIONS,
		},
		global: {
			plugins: [ store ],
			provide: {
				[ StoreKey as symbol ]: store,
			},
			components: {
				FeatureToggle: createFeatureToggle( [] ),
			},
		},
	} );

	let wrapper: any;
	beforeEach( () => {
		originalStoreDispatch = store.dispatch;
		wrapper = mount( AddressForms, createOptionsForAddressType( AddressTypeModel.PERSON ) );
	} );

	afterEach( () => {
		store.dispatch = originalStoreDispatch;
	} );

	each( [
		[ AddressTypeModel.ANON, 'address-type-anonymous' ],
		[ AddressTypeModel.EMAIL, 'address-type-email' ],
		[ AddressTypeModel.UNSET, 'address-type-person' ],
		[ AddressTypeModel.PERSON, 'address-type-person' ],
		[ AddressTypeModel.COMPANY, 'address-type-company' ],
	] ).test( 'adapts the class attribute', ( addressType, expectedClass ) => {
		const options = createOptionsForAddressType( addressType );
		wrapper = mount( AddressForms, options );
		expect( wrapper.classes() ).toContain( expectedClass );
	} );

	it( 'sets address field in store when it receives field-changed event', async () => {
		store.dispatch = jest.fn();
		const expectedAction = action( 'address', 'setAddressField' );
		const firstNameValue = 'Vuetiful';
		await wrapper.find( '#person-first-name' ).setValue( firstNameValue );

		wrapper.findComponent( NameFields ).vm.$emit( 'field-changed', 'firstName' );
		expect( store.dispatch ).toBeCalledWith( expectedAction, {
			'name': 'firstName',
			'optionalField': false,
			'pattern': addressValidationPatterns.firstName,
			'value': firstNameValue,
		} );
	} );

	it( 'sets receipt preference in store when it receives receipt-changed event', async () => {
		store.dispatch = jest.fn();
		const expectedAction = action( 'address', 'setReceiptChoice' );
		const expectedPayload = false;
		await wrapper.find( '#receipt-option-company' ).setValue( false );
		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'sets email in store when it receives email event', async () => {
		const testEmail = 'test@wikimedia.de';
		store.dispatch = jest.fn();
		await wrapper.find( '#person-email' ).setValue( testEmail );

		const expectedAction = action( 'address', 'setAddressField' );
		wrapper.findComponent( EmailField ).vm.$emit( 'field-changed', 'email' );
		expect( store.dispatch ).toBeCalledWith( expectedAction, {
			'name': 'email',
			'optionalField': false,
			'pattern': addressValidationPatterns.email,
			'value': testEmail,
		} );
	} );

	it( 'populates form data and validates if initial data is available', async () => {
		const firstName = { name: 'firstName', value: 'Spooky', validity: Validity.RESTORED };
		const lastName = { name: 'lastName', value: 'Magoo', validity: Validity.RESTORED };
		const initialData = {
			addressType: AddressTypeModel.PERSON,
			fields: [ firstName, lastName ],
		};
		await store.dispatch( action( 'address', 'initializeAddress' ), initialData );
		wrapper = mount( AddressForms, {
			props: {
				addressType: AddressTypeModel.PERSON,
				validateAddressUrl: 'validate-address',
				countries: countries,
				addressValidationPatterns: addressValidationPatterns,
				trackingData: {
					bannerImpressionCount: 1,
					impressionCount: 5,
				},
				campaignValues: {
					campaign: 'nicholas',
					keyword: 'cage',
				},
				salutations: EXAMPLE_SALUTATIONS,
			},
			global: {
				plugins: [ store ],
				provide: {
					[ StoreKey as symbol ]: store,
				},
				mocks: {
					$t: ( key: string ) => key,
				},
				components: {
					FeatureToggle: createFeatureToggle( [] ),
				},
			},
		} );

		expect( wrapper.find( '#person-first-name' ).element.value ).toBe( firstName.value );
		expect( wrapper.find( '#person-last-name' ).element.value ).toBe( lastName.value );
		expect( store.state.address.validity.firstName ).not.toBe( Validity.RESTORED );
		expect( store.state.address.validity.lastName ).not.toBe( Validity.RESTORED );
	} );

} );
