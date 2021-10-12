import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import CompositionAPI from '@vue/composition-api';
import AddressForms from '@/components/pages/donation_form/AddressForms.vue';
import Name from '@/components/shared/Name.vue';
import ReceiptOptOut from '@/components/shared/ReceiptOptOut.vue';
import Email from '@/components/shared/Email.vue';
import { createStore } from '@/store/donation_store';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { NS_ADDRESS } from '@/store/namespaces';
import { initializeAddress, setAddressField, setReceiptOptOut } from '@/store/address/actionTypes';
import { action } from '@/store/util';
import countries from '@/../tests/data/countries';
import { Validity } from '@/view_models/Validity';
import { addressValidationPatterns } from '../../../../data/validation';
import each from 'jest-each';
import createCookieConsent from '@/cookie_consent';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );
localVue.use( CompositionAPI );

describe( 'AddressForms.vue', () => {

	const createOptionsForAddressType = ( addressType: AddressTypeModel ) => ( {
		localVue,
		propsData: {
			countries: countries,
			addressValidationPatterns: addressValidationPatterns,
			addressType,
			isFullSelected: true,
			trackingData: {
				bannerImpressionCount: 1,
				impressionCount: 5,
			},
		},
		provide: {
			cookieConsent: createCookieConsent( 'yes' ),
		},
		store: createStore(),
		mocks: {
			$t: () => { },
		},
	} );

	let wrapper: any;
	beforeEach( () => {
		wrapper = mount( AddressForms, createOptionsForAddressType( AddressTypeModel.PERSON ) );
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
		options.propsData.isFullSelected = isFullSelected;
		wrapper = mount( AddressForms, options );
		expect( wrapper.classes() ).toContain( expectedClass );
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

	it( 'sets receipt opt out preference in store when it receives opted-out event', async () => {
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
			wrapper = mount( AddressForms, {
				localVue,
				propsData: {
					validateAddressUrl: 'validate-address',
					countries: countries,
					addressValidationPatterns: addressValidationPatterns,
					trackingData: {
						bannerImpressionCount: 1,
						impressionCount: 5,
					},
				},
				provide: {
					cookieConsent: createCookieConsent( 'yes' ),
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
