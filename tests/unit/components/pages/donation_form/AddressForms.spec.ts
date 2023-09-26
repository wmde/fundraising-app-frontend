import { mount } from '@vue/test-utils';
import AddressForms from '@src/components/pages/donation_form/AddressForms.vue';
import ReceiptOption from '../../../../../src/components/shared/ReceiptOption.vue';
import EmailAddress from '@src/components/shared/EmailAddress.vue';
import NameFields from '@src/components/shared/NameFields.vue';
import { createStore, StoreKey } from '@src/store/donation_store';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { NS_ADDRESS } from '@src/store/namespaces';
import { initializeAddress, setAddressField, setReceiptChoice } from '@src/store/address/actionTypes';
import { action } from '@src/store/util';
import countries from '@src/../tests/data/countries';
import { Validity } from '@src/view_models/Validity';
import { addressValidationPatterns } from '../../../../data/validation';
import each from 'jest-each';

const store = createStore();

const EXAMPLE_SALUTATIONS = [
	{
		label: 'Mr',
		value: 'Herr',
	},
	{
		label: 'Ms',
		value: 'Frau',
	},
	{
		label: 'No Salutation',
		value: 'Divers',
	},
];

describe( 'AddressForms.vue', () => {

	let originalStoreDispatch: any;

	const createOptionsForAddressType = ( addressType: AddressTypeModel ) => ( {
		props: {
			countries: countries,
			addressValidationPatterns: addressValidationPatterns,
			addressType,
			isFullSelected: true,
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
		[ AddressTypeModel.ANON, false, 'address-type-anonymous' ],
		[ AddressTypeModel.EMAIL, false, 'address-type-email' ],
		[ AddressTypeModel.UNSET, false, 'address-type-unset' ],
		[ AddressTypeModel.UNSET, true, 'address-type-person' ],
		[ AddressTypeModel.PERSON, true, 'address-type-person' ],
		[ AddressTypeModel.COMPANY, true, 'address-type-company' ],
	] ).test( 'adapts the class attribute', ( addressType, isFullSelected, expectedClass ) => {
		const options = createOptionsForAddressType( addressType );
		options.props.isFullSelected = isFullSelected;
		wrapper = mount( AddressForms, options );
		expect( wrapper.classes() ).toContain( expectedClass );
	} );

	it( 'sets address field in store when it receives field-changed event', async () => {
		store.dispatch = jest.fn();
		const expectedAction = action( NS_ADDRESS, setAddressField );
		const firstNameValue = 'Vuetiful';
		await wrapper.find( '#first-name' ).setValue( firstNameValue );

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
		const expectedAction = action( NS_ADDRESS, setReceiptChoice );
		const expectedPayload = true;
		wrapper.findComponent( ReceiptOption ).vm.$emit( 'receipt-changed', true );
		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'sets email in store when it receives email event', async () => {
		const testEmail = 'test@wikimedia.de';
		store.dispatch = jest.fn();
		await wrapper.find( '#email' ).setValue( testEmail );

		const expectedAction = action( NS_ADDRESS, setAddressField );
		wrapper.findComponent( EmailAddress ).vm.$emit( 'field-changed', 'email' );
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
		await store.dispatch( action( NS_ADDRESS, initializeAddress ), initialData );
		wrapper = mount( AddressForms, {
			props: {
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
			},
		} );

		expect( wrapper.find( '#first-name' ).element.value ).toBe( firstName.value );
		expect( wrapper.find( '#last-name' ).element.value ).toBe( lastName.value );
		expect( store.state.address.validity.firstName ).not.toBe( Validity.RESTORED );
		expect( store.state.address.validity.lastName ).not.toBe( Validity.RESTORED );
	} );

} );
