import { mount, VueWrapper } from '@vue/test-utils';
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
import { Store } from 'vuex';

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

	const getWrapper = ( addressType: AddressTypeModel, store: Store<any> = createStore() ): VueWrapper<any> => {
		return mount( AddressForms, {
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
	};

	each( [
		[ AddressTypeModel.EMAIL, '#laika-donation-personal-data-email' ],
		[ AddressTypeModel.UNSET, '#laika-donation-personal-data-person' ],
		[ AddressTypeModel.PERSON, '#laika-donation-personal-data-person' ],
		[ AddressTypeModel.COMPANY, '#laika-donation-personal-data-company' ],
	] ).test( 'shows the form based on the address type', ( addressType, formId ) => {
		const wrapper = getWrapper( addressType );

		expect( wrapper.find( formId ).classes() ).toContain( 'display-toggler--visible' );
	} );

	it( 'shows no form for anonymous', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );

		expect( wrapper.findAll( '.display-toggler--visible' ).length ).toStrictEqual( 0 );
	} );

	it( 'sets address field in store when it receives field-changed event', async () => {
		const store = createStore();
		store.dispatch = jest.fn();
		const expectedAction = action( 'address', 'setAndValidateAddressField' );
		const firstNameValue = 'Vuetiful';
		const wrapper = getWrapper( AddressTypeModel.PERSON, store );

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
		const store = createStore();
		store.dispatch = jest.fn();
		const expectedAction = action( 'address', 'setReceiptChoice' );
		const expectedPayload = false;
		const wrapper = getWrapper( AddressTypeModel.PERSON, store );

		await wrapper.find( '#receipt-option-company' ).setValue( false );
		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'sets email in store when it receives email event', async () => {
		const testEmail = 'test@wikimedia.de';
		const store = createStore();
		store.dispatch = jest.fn();
		const wrapper = getWrapper( AddressTypeModel.PERSON, store );

		await wrapper.find( '#person-email' ).setValue( testEmail );

		const expectedAction = action( 'address', 'setAndValidateAddressField' );
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
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), initialData );
		const wrapper = getWrapper( AddressTypeModel.PERSON, store );

		expect( wrapper.find<HTMLInputElement>( '#person-first-name' ).element.value ).toBe( firstName.value );
		expect( wrapper.find<HTMLInputElement>( '#person-last-name' ).element.value ).toBe( lastName.value );
		expect( store.state.address.validity.firstName ).not.toBe( Validity.RESTORED );
		expect( store.state.address.validity.lastName ).not.toBe( Validity.RESTORED );
	} );

} );
