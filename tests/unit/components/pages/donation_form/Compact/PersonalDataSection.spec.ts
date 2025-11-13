import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import PersonalDataSection from '@src/components/pages/donation_form/Compact/PersonalDataSection.vue';
import { Store } from 'vuex';
import { Validity } from '@src/view_models/Validity';
import { action } from '@src/store/util';

const testCountry = {
	countryCode: 'de',
	countryFullName: 'Germany',
	group: '',
	postCodeValidation: '',
};

const salutations: Salutation[] = [
	{
		label: 'Herr',
		value: 'Herr',
		display: 'Herr',
		greetings: {
			formal: 'Herr',
			informal: 'Herr',
			lastNameInformal: 'Herr',
		},
	},
];

describe( 'PersonalDataSection.vue', () => {
	const getWrapper = ( store: Store<any> = createStore() ): VueWrapper<any> => {
		return mount( PersonalDataSection, {
			props: {
				countries: [ testCountry ],
				salutations,
				trackingData: {} as TrackingData,
				campaignValues: {} as CampaignValues,
				addressValidationPatterns: { postcode: '\\p{L}+', city: '\\p{L}+', street: '\\p{L}+', country: null } as AddressValidation,
				isDirectDebitPayment: false,
				disabledAddressTypes: [],
				addressType: AddressTypeModel.UNSET,
				receiptNeeded: false,
				addressTypeIsInvalid: false,
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'initialises fields on mount', async () => {
		const store = createStore();
		const firstName = { name: 'firstName', value: 'Spooky', validity: Validity.RESTORED };
		await store.dispatch( action( 'address', 'initializeAddress' ), { addressType: AddressTypeModel.PERSON, fields: [ firstName ] } );

		getWrapper( store );

		expect( store.state.address.validity.firstName ).toStrictEqual( Validity.VALID );
	} );

	it( 'emits the receipt needed event', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#donation-receipt' ).setValue( true );

		expect( wrapper.emitted( 'receipt-needed-toggled' ).length ).toStrictEqual( 1 );
	} );

	it( 'updates the address type when receipt needed changes', async () => {
		const store = createStore();
		const wrapper = getWrapper( store );

		expect( store.state.address.addressType ).toStrictEqual( AddressTypeModel.EMAIL );

		await wrapper.setProps( { receiptNeeded: true } );

		expect( store.state.address.addressType ).toStrictEqual( AddressTypeModel.PERSON );
	} );

	it( 'updates the address type when is company changes', async () => {
		const store = createStore();
		const wrapper = getWrapper( store );

		expect( store.state.address.addressType ).toStrictEqual( AddressTypeModel.EMAIL );

		await wrapper.find( '#is-company' ).setValue( true );

		expect( store.state.address.addressType ).toStrictEqual( AddressTypeModel.COMPANY_WITH_CONTACT );

		await wrapper.setProps( { receiptNeeded: true } );

		expect( store.state.address.addressType ).toStrictEqual( AddressTypeModel.COMPANY_WITH_CONTACT );
	} );

	it( 'updates the address type when address data is entered', async () => {
		const store = createStore();
		const wrapper = getWrapper( store );

		await wrapper.find( '#post-code' ).setValue( '12345' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		expect( store.state.address.addressType ).toStrictEqual( AddressTypeModel.PERSON );
	} );

	it( 'does not validate address fields on blur when address type is email and address is empty', async () => {
		jest.useFakeTimers();

		const store = createStore();
		const wrapper = getWrapper( store );
		await wrapper.setProps( { addressType: AddressTypeModel.EMAIL, receiptNeeded: false } );

		await wrapper.find( '#post-code' ).trigger( 'blur' );
		await wrapper.find( '#city' ).trigger( 'blur' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( store.state.address.validity.postcode ).toStrictEqual( Validity.INCOMPLETE );
		expect( store.state.address.validity.city ).toStrictEqual( Validity.INCOMPLETE );
		expect( store.state.address.validity.street ).toStrictEqual( Validity.INCOMPLETE );

		jest.clearAllMocks();
	} );

	it( 'validates address fields on blur when address type is person', async () => {
		jest.useFakeTimers();

		const store = createStore();
		const wrapper = getWrapper( store );
		await wrapper.setProps( { addressType: AddressTypeModel.PERSON, receiptNeeded: true } );

		await wrapper.find( '#post-code' ).trigger( 'blur' );
		await wrapper.find( '#city' ).trigger( 'blur' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( store.state.address.validity.postcode ).toStrictEqual( Validity.INVALID );
		expect( store.state.address.validity.city ).toStrictEqual( Validity.INVALID );
		expect( store.state.address.validity.street ).toStrictEqual( Validity.INVALID );

		jest.clearAllMocks();
	} );

	it( 'validates address fields on blur when address type is company', async () => {
		jest.useFakeTimers();

		const store = createStore();
		const wrapper = getWrapper( store );
		await wrapper.setProps( { addressType: AddressTypeModel.PERSON, receiptNeeded: true } );

		await wrapper.find( '#is-company' ).setValue( true );
		await wrapper.find( '#post-code' ).trigger( 'blur' );
		await wrapper.find( '#city' ).trigger( 'blur' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( store.state.address.validity.postcode ).toStrictEqual( Validity.INVALID );
		expect( store.state.address.validity.city ).toStrictEqual( Validity.INVALID );
		expect( store.state.address.validity.street ).toStrictEqual( Validity.INVALID );

		jest.clearAllMocks();
	} );

	it( 'removes the errors from an empty address', async () => {
		jest.useFakeTimers();

		const store = createStore();
		const wrapper = getWrapper( store );
		await wrapper.setProps( { addressType: AddressTypeModel.PERSON, receiptNeeded: true } );

		await wrapper.find( '#post-code' ).trigger( 'blur' );
		await wrapper.find( '#city' ).trigger( 'blur' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( store.state.address.validity.postcode ).toStrictEqual( Validity.INVALID );
		expect( store.state.address.validity.city ).toStrictEqual( Validity.INVALID );
		expect( store.state.address.validity.street ).toStrictEqual( Validity.INVALID );

		await wrapper.setProps( { addressType: AddressTypeModel.EMAIL, receiptNeeded: false } );

		await wrapper.find( '#post-code' ).trigger( 'blur' );

		expect( store.state.address.validity.postcode ).toStrictEqual( Validity.INCOMPLETE );
		expect( store.state.address.validity.city ).toStrictEqual( Validity.INCOMPLETE );
		expect( store.state.address.validity.street ).toStrictEqual( Validity.INCOMPLETE );
	} );
} );
