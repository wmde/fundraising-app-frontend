import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import Address from '@/components/pages/donation_form/Address.vue';
import Name from '@/components/shared/Name.vue';
import Postal from '@/components/shared/Postal.vue';
import ReceiptOptOut from '@/components/shared/ReceiptOptOut.vue';
import AddressType from '@/components/pages/donation_form/AddressType.vue';
import Email from '@/components/shared/Email.vue';
import PaymentBankData from '@/components/shared/PaymentBankData.vue';
import NewsletterOptIn from '@/components/pages/donation_form/NewsletterOptIn.vue';
import { createStore } from '@/store/donation_store';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { NS_ADDRESS } from '@/store/namespaces';
import { setAddressField, setReceiptOptOut, setAddressType, initializeAddress } from '@/store/address/actionTypes';
import { action } from '@/store/util';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import countries from '@/../tests/data/countries';
import { Validity } from '@/view_models/Validity';
import { addressValidationPatterns } from '../../../../data/validation';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );

localVue.use( FeatureTogglePlugin, { activeFeatures: [ 'campaigns.address_type.preselection' ] } );

describe( 'Address.vue', () => {
	let wrapper: any;
	beforeEach( () => {
		wrapper = mount( Address, {
			localVue,
			propsData: {
				validateAddressUrl: 'validate-address',
				countries: countries,
				initialFormValues: '',
				addressValidationPatterns: addressValidationPatterns,
			},
			store: createStore(),
			mocks: {
				$t: () => { },
			},
		} );
	} );
	it( 'renders components which are part of the donation address page', () => {
		expect( wrapper.findComponent( Name ).exists() ).toBe( true );
		expect( wrapper.findComponent( Postal ).exists() ).toBe( true );
		expect( wrapper.findComponent( ReceiptOptOut ).exists() ).toBe( true );
		expect( wrapper.findComponent( AddressType ).exists() ).toBe( true );
		expect( wrapper.findComponent( Email ).exists() ).toBe( true );
		expect( wrapper.findComponent( NewsletterOptIn ).exists() ).toBe( true );
	} );

	it( 'renders Bank Data component only if payment is direct debit', () => {
		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBe( false );
		// Stub payment option direct debit (BEZ) being selected
		const comp = wrapper.vm.$options!.computed;
		if ( typeof comp.isDirectDebit === 'function' ) {
			comp.isDirectDebit = jest.fn( () => true );
			expect( wrapper.findComponent( PaymentBankData ).exists() ).toBe( true );
		}
	} );

	it( 'does not render postal and receipt opt out if adress type is anonymous', async () => {
		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.ANON );
		await wrapper.vm.$nextTick();
		expect( wrapper.findComponent( Postal ).exists() ).toBe( false );
		expect( wrapper.findComponent( ReceiptOptOut ).exists() ).toBe( false );
	} );

	it( 'sets address type in store when it receives address-type event', () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();
		const expectedAction = action( NS_ADDRESS, setAddressType );
		const expectedPayload = AddressTypeModel.ANON;
		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.ANON );
		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'sets address field in store when it receives field-changed event', () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();
		const expectedAction = action( NS_ADDRESS, setAddressField );
		const firstNameValue = 'Vuetiful';
		wrapper.vm.$data.formData.firstName.value = firstNameValue;

		wrapper.findComponent( Name ).vm.$emit( 'field-changed', 'firstName' );
		expect( store.dispatch ).toBeCalledWith( expectedAction, {
			'name': 'firstName',
			'optionalField': false,
			'pattern': addressValidationPatterns.firstName,
			'value': firstNameValue,
		} );
	} );

	it( 'sets receipt opt out preference in store when it receives opted-out event', () => {
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();
		const expectedAction = action( NS_ADDRESS, setReceiptOptOut );
		const expectedPayload = true;
		wrapper.findComponent( ReceiptOptOut ).vm.$emit( 'opted-out', true );
		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'sets email in store when it receives email event', () => {
		const store = wrapper.vm.$store;
		const testEmail = 'test@wikimedia.de';
		store.dispatch = jest.fn();
		wrapper.vm.$data.formData.email.value = testEmail;
		const expectedAction = action( NS_ADDRESS, setAddressField );
		wrapper.findComponent( Email ).vm.$emit( 'field-changed', 'email' );
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
		await store.dispatch( action( NS_ADDRESS, initializeAddress ), initialData ).then( () => {
			wrapper = mount( Address, {
				localVue,
				propsData: {
					validateAddressUrl: 'validate-address',
					countries: countries,
					addressValidationPatterns: addressValidationPatterns,
				},
				store,
				mocks: {
					$t: () => { },
				},
			} );
		} );

		expect( wrapper.vm.$data.formData.firstName.value ).toBe( firstName.value );
		expect( wrapper.vm.$data.formData.lastName.value ).toBe( lastName.value );
		expect( store.state.address.validity.firstName ).not.toBe( Validity.RESTORED );
		expect( store.state.address.validity.lastName ).not.toBe( Validity.RESTORED );
	} );

} );
