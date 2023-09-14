import { mount, VueWrapper } from '@vue/test-utils';
import Address from '@src/components/pages/membership_form/Address.vue';
import Name from '@src/components/shared/Name.vue';
import Postal from '@src/components/shared/Postal.vue';
import ReceiptOption from '../../../../../src/components/shared/ReceiptOption.vue';
import EmailAddress from '@src/components/shared/EmailAddress.vue';
import DateOfBirth from '@src/components/pages/membership_form/DateOfBirth.vue';
import { createStore } from '@src/store/membership_store';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { initializeAddress, setAddressField, setReceiptChoice } from '@src/store/membership_address/actionTypes';
import { action } from '@src/store/util';
import countries from '@src/../tests/data/countries';
import { Validity } from '@src/view_models/Validity';
import { addressValidationPatterns } from '../../../../data/validation';
import { Store } from 'vuex';

describe( 'Address.vue', () => {

	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( Address, {
			props: {
				validateAddressUrl: 'validate-address',
				countries: countries,
				addressValidationPatterns: addressValidationPatterns,
			},
			global: {
				plugins: [ store ],
			},
		} );

		return { wrapper, store };
	};

	it( 'renders components which are part of the donation address page', () => {
		const { wrapper } = getWrapper();
		expect( wrapper.findComponent( Name ).exists() ).toBe( true );
		expect( wrapper.findComponent( Postal ).exists() ).toBe( true );
		expect( wrapper.findComponent( ReceiptOption ).exists() ).toBe( true );
		expect( wrapper.findComponent( EmailAddress ).exists() ).toBe( true );
		expect( wrapper.findComponent( DateOfBirth ).exists() ).toBe( true );
	} );

	it( 'sets address field in store when it receives field-changed event', () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();
		const expectedAction = action( NS_MEMBERSHIP_ADDRESS, setAddressField );
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

	it( 'sets receipt preference in store when it receives receipt-changed event', () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();
		const expectedAction = action( NS_MEMBERSHIP_ADDRESS, setReceiptChoice );
		const expectedPayload = true;

		wrapper.findComponent( ReceiptOption ).vm.$emit( 'receipt-changed', true );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'sets email in store when it receives email event', () => {
		const { wrapper, store } = getWrapper();
		const testEmail = 'test@wikimedia.de';
		store.dispatch = jest.fn();
		wrapper.vm.$data.formData.email.value = testEmail;
		const expectedAction = action( NS_MEMBERSHIP_ADDRESS, setAddressField );

		wrapper.findComponent( EmailAddress ).vm.$emit( 'field-changed', 'email' );

		expect( store.dispatch ).toBeCalledWith( expectedAction, {
			'name': 'email',
			'optionalField': false,
			'pattern': '^(.+)@(.+)\\.(.+)$',
			'value': testEmail,
		} );
	} );

	it( 'populates form data and validates if initial data is available', async () => {
		const firstName = 'Testina';
		const lastName = 'Testinson';
		const title = 'Prof Dr.';

		const store = createStore();
		await store.dispatch( action( NS_MEMBERSHIP_ADDRESS, initializeAddress ), {
			addressType: AddressTypeModel.PERSON,
			fields: [
				{
					name: 'email',
					value: 'playthatfunkymusic@example.com',
					validity: Validity.RESTORED,
				},
				{
					name: 'firstName',
					value: firstName,
					validity: Validity.RESTORED,
				},
				{
					name: 'lastName',
					value: lastName,
					validity: Validity.RESTORED,
				},
				{
					name: 'title',
					value: title,
					validity: Validity.RESTORED,
				},
			],
		} );

		const { wrapper } = getWrapper( store );

		expect( wrapper.vm.$data.formData.firstName.value ).toBe( firstName );
		expect( wrapper.vm.$data.formData.lastName.value ).toBe( lastName );
		expect( wrapper.vm.$data.formData.title.value ).toBe( title );
		expect( store.state.membership_address.validity.firstName ).not.toBe( Validity.RESTORED );
		expect( store.state.membership_address.validity.lastName ).not.toBe( Validity.RESTORED );
	} );

} );
