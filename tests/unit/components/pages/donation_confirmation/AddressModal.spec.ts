import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import AddressModal from '@src/components/pages/donation_confirmation/AddressModal.vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { initializeAddress } from '@src/store/address/actionTypes';
import { addressValidationPatterns } from '../../../../data/validation';
import { anonymousBankTransferConfirmationData, bankTransferConfirmationData } from '../../../../data/confirmationData';
import { Address } from '@src/view_models/Address';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import { Store } from 'vuex';
import { nextTick } from 'vue';

const anonAddress = {
	addressType: 'anonym',
	salutation: '',
	title: '',
	firstName: '',
	lastName: '',
	fullName: '',
	companyName: '',
	street: '',
	postcode: '',
	city: '',
	country: 'DE',
	email: '',
};

const validAddress = {
	addressType: 'person',
	salutation: 'Herr',
	title: '',
	firstName: 'Johnny',
	lastName: 'Lawrence',
	fullName: 'Johnny Lawrence',
	companyName: 'Eagle Fang Karate',
	street: 'Sesame',
	postcode: '12345',
	city: 'Berlin',
	country: 'DE',
	email: 'not.a.real.email@domainlalalaxoxoxo.de',
};

const addressData = ( address: Address, addressType: AddressTypeModel ) => {
	return {
		addressType,
		newsletter: true,
		fields: [
			{ name: 'salutation', value: address.salutation, validity: Validity.INCOMPLETE },
			{ name: 'title', value: address.title, validity: Validity.INCOMPLETE },
			{ name: 'firstName', value: address.firstName, validity: Validity.INCOMPLETE },
			{ name: 'lastName', value: address.lastName, validity: Validity.INCOMPLETE },
			{ name: 'companyName', value: address.companyName, validity: Validity.INCOMPLETE },
			{ name: 'street', value: address.street, validity: Validity.INCOMPLETE },
			{ name: 'postcode', value: address.postcode, validity: Validity.INCOMPLETE },
			{ name: 'city', value: address.city, validity: Validity.INCOMPLETE },
			{ name: 'country', value: address.country, validity: Validity.INCOMPLETE },
			{ name: 'email', value: address.email, validity: Validity.INCOMPLETE },
		],
	};
};

describe( 'AddressModal.vue', () => {
	const getWrapper = ( store: Store<any>, confirmationData: Object, donorResource: Object = {} ): VueWrapper<any> => {
		return mount( AddressModal, {
			props: {
				validateEmailUrl: '',
				validateAddressUrl: '',
				hasErrored: false,
				hasSucceeded: false,
				addressValidationPatterns,
				donorResource,
				...confirmationData,
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'prefills address data if it exists', async () => {
		const store = createStore();
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( validAddress, AddressTypeModel.PERSON )
		);

		const wrapper = getWrapper( store, bankTransferConfirmationData );

		expect( wrapper.find<HTMLInputElement>( '[name="salutationInternal"]' ).element.value ).toBe( validAddress.salutation );
		expect( wrapper.find<HTMLInputElement>( '#title' ).element.value ).toBe( validAddress.title );
		expect( wrapper.find<HTMLInputElement>( '#first-name' ).element.value ).toBe( validAddress.firstName );
		expect( wrapper.find<HTMLInputElement>( '#last-name' ).element.value ).toBe( validAddress.lastName );
		expect( wrapper.find<HTMLInputElement>( '#street' ).element.value ).toBe( validAddress.street );
		expect( wrapper.find<HTMLInputElement>( '#post-code' ).element.value ).toBe( validAddress.postcode );
		expect( wrapper.find<HTMLInputElement>( '#city' ).element.value ).toBe( validAddress.city );
		expect( wrapper.find<HTMLInputElement>( '#country' ).element.value ).toBe( 'Deutschland' );
		expect( wrapper.find<HTMLInputElement>( '#email' ).element.value ).toBe( validAddress.email );
		expect( wrapper.find<HTMLInputElement>( '[name="newsletter"]' ).element.checked ).toBe( true );
	} );

	it( 'marks address type invalid if submitted without selecting', async () => {
		const store = createStore();
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( anonAddress, AddressTypeModel.ANON )
		);

		const wrapper = getWrapper( store, anonymousBankTransferConfirmationData );

		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		expect( wrapper.find( '.error-address-type' ).exists() ).toBe( true );
	} );

	it( 'marks empty address fields invalid if submitted after selecting address type', async () => {
		const store = createStore();
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( anonAddress, AddressTypeModel.ANON )
		);

		const wrapper = getWrapper( store, bankTransferConfirmationData );

		await wrapper.find( '#address-type-person input' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );

		await wrapper.vm.$nextTick();

		expect( wrapper.find( '.error-salutation' ).exists() ).toBe( true );
		expect( wrapper.find( '.error-first-name' ).exists() ).toBe( true );
		expect( wrapper.find( '.error-last-name' ).exists() ).toBe( true );
		expect( wrapper.find( '.error-street' ).exists() ).toBe( true );
		expect( wrapper.find( '.error-postcode' ).exists() ).toBe( true );
		expect( wrapper.find( '.error-city' ).exists() ).toBe( true );
		expect( wrapper.find( '.error-email' ).exists() ).toBe( true );
	} );

	it( 'displays an error if one is returned from the server', async () => {
		const store = createStore();
		store.dispatch = jest.fn().mockResolvedValue( { status: 'OK', messages: {} } );

		const error = 'Get outta that garden!';
		const donorResource = {
			put: jest.fn().mockRejectedValue( error ),
		};

		const wrapper = getWrapper( store, bankTransferConfirmationData, donorResource );

		await wrapper.find( '#address-update-form' ).trigger( 'submit' );

		// The submission process goes many promises deep, so wait until they all resolve
		await nextTick();
		await nextTick();
		await nextTick();
		await nextTick();
		await nextTick();

		expect( wrapper.vm.$data.serverMessage ).toBe( error );
		expect( wrapper.find( '.error-server' ).exists() ).toBe( true );
	} );
} );
