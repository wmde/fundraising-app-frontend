import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import CompositionAPI from '@vue/composition-api';
import AddressForms from '@/components/pages/donation_form/AddressForms.vue';
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
import { setAddressField, setReceiptOptOut, initializeAddress } from '@/store/address/actionTypes';
import { action } from '@/store/util';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import countries from '@/../tests/data/countries';
import { Validity } from '@/view_models/Validity';
import { addressValidationPatterns } from '../../../../data/validation';
import { SET_ADDRESS_TYPE } from '@/store/address/mutationTypes';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );
localVue.use( CompositionAPI );

localVue.use( FeatureTogglePlugin, { activeFeatures: [ 'campaigns.address_type.preselection' ] } );

describe.skip( 'AddressForms.vue', () => {
	let wrapper: any;
	beforeEach( () => {
		wrapper = mount( AddressForms, {
			localVue,
			propsData: {
				validateAddressUrl: 'validate-address',
				countries: countries,
				initialFormValues: '',
				addressValidationPatterns: addressValidationPatterns,
				isDirectDebit: false,
			},
			store: createStore(),
			mocks: {
				$t: () => { },
			},
		} );
	} );

	it( 'renders components which are part of the donation address page', async () => {
		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.PERSON );
		await wrapper.vm.$nextTick();
		expect( wrapper.findComponent( Name ).exists() ).toBe( true );
		expect( wrapper.findComponent( Postal ).exists() ).toBe( true );
		expect( wrapper.findComponent( ReceiptOptOut ).exists() ).toBe( true );
		expect( wrapper.findComponent( AddressType ).exists() ).toBe( true );
		expect( wrapper.findComponent( Email ).exists() ).toBe( true );
		expect( wrapper.findComponent( NewsletterOptIn ).exists() ).toBe( true );
	} );

	it( 'hides Bank Data component if payment is not direct debit', () => {
		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBe( false );
	} );

	it( 'renders Bank Data component if payment is direct debit', () => {
		wrapper = mount( AddressForms, {
			localVue,
			propsData: {
				validateAddressUrl: 'validate-address',
				countries: countries,
				initialFormValues: '',
				addressValidationPatterns: addressValidationPatterns,
				isDirectDebit: true,
			},
			store: createStore(),
			mocks: {
				$t: () => { },
			},
		} );
		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBe( true );
	} );

	it( 'does not render postal and receipt opt out if adress type is anonymous', async () => {
		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.ANON );
		await wrapper.vm.$nextTick();
		expect( wrapper.findComponent( Postal ).exists() ).toBe( false );
		expect( wrapper.findComponent( ReceiptOptOut ).exists() ).toBe( false );
	} );

	xit( 'sets address field in store when it receives field-changed event', () => {
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

	xit( 'sets receipt opt out preference in store when it receives opted-out event', async () => {
		const store = wrapper.vm.$store;
		store.commit( SET_ADDRESS_TYPE, AddressTypeModel.PERSON );
		await wrapper.vm.$nextTick();
		store.dispatch = jest.fn();
		const expectedAction = action( NS_ADDRESS, setReceiptOptOut );
		const expectedPayload = true;
		wrapper.findComponent( ReceiptOptOut ).vm.$emit( 'opted-out', true );
		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	xit( 'sets email in store when it receives email event', () => {
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
			wrapper = mount( AddressForms, {
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
