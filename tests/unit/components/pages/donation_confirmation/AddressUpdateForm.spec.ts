import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donor_update_store';
import AddressUpdateForm from '@src/components/pages/donation_confirmation/AddressUpdateForm.vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { initializeAddress } from '@src/store/address/actionTypes';
import { addressValidationPatterns } from '@test/data/validation';
import { anonymousBankTransferConfirmationData, bankTransferConfirmationData } from '@test/data/confirmationData';
import { Address } from '@src/view_models/Address';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import { Store } from 'vuex';
import { DonorResource } from '@src/api/DonorResource';

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

const inValidAddress = {
	addressType: 'person',
	salutation: '',
	title: '',
	firstName: '',
	lastName: '',
	fullName: '',
	companyName: '',
	street: '',
	postcode: '',
	city: '',
	country: '',
	email: 'not.a.real.email@domainlalalaxoxoxo.de',
};

const emptyAddress = {
	addressType: '',
	salutation: '',
	title: '',
	firstName: '',
	lastName: '',
	fullName: '',
	companyName: '',
	street: '',
	postcode: '',
	city: '',
	country: '',
	email: '',
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

const defaultDonorResource: DonorResource = {
	put(): Promise<Address> {
		return Promise.resolve( undefined );
	},
};

describe( 'AddressUpdateForm.vue', () => {
	const getWrapper = ( store: Store<any>, confirmationData: any, donorResource: DonorResource = defaultDonorResource ): VueWrapper<any> => {
		return mount( AddressUpdateForm, {
			props: {
				addressValidationPatterns,
				donation: {},
				donorResource,
				validateEmailUrl: '',
				validateAddressUrl: '',
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

		expect( wrapper.find<HTMLInputElement>( '[name="salutation"]' ).element.value ).toBe( validAddress.salutation );
		expect( wrapper.find<HTMLInputElement>( '#title' ).element.value ).toBe( validAddress.title );
		expect( wrapper.find<HTMLInputElement>( '#first-name' ).element.value ).toBe( validAddress.firstName );
		expect( wrapper.find<HTMLInputElement>( '#last-name' ).element.value ).toBe( validAddress.lastName );
		expect( wrapper.find<HTMLInputElement>( '#street' ).element.value ).toBe( validAddress.street );
		expect( wrapper.find<HTMLInputElement>( '#post-code' ).element.value ).toBe( validAddress.postcode );
		expect( wrapper.find<HTMLInputElement>( '#city' ).element.value ).toBe( validAddress.city );
		expect( wrapper.find<HTMLInputElement>( '#country' ).element.value ).toBe( 'Deutschland' );
		expect( wrapper.find<HTMLInputElement>( '#email' ).element.value ).toBe( validAddress.email );
		expect( wrapper.find<HTMLInputElement>( '#newsletter' ).element.checked ).toBe( true );
	} );

	it( 'marks address type invalid if submitted without selecting', async () => {
		const store = createStore();
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( anonAddress, AddressTypeModel.ANON )
		);

		const wrapper = getWrapper( store, anonymousBankTransferConfirmationData );

		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		expect( wrapper.find( '.address-type-field .is-danger' ).exists() ).toBe( true );
	} );

	it( 'marks empty address fields invalid if submitted after selecting address type', async () => {
		const store = createStore();
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( anonAddress, AddressTypeModel.ANON )
		);

		const wrapper = getWrapper( store, bankTransferConfirmationData );

		await wrapper.find( '#addressType-0' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );

		await wrapper.vm.$nextTick();

		const nameSectionText = wrapper.find( '.name-section' ).text();
		expect( nameSectionText ).toContain( 'donation_form_salutation_error' );
		expect( nameSectionText ).toContain( 'donation_form_firstname_error' );
		expect( nameSectionText ).toContain( 'donation_form_lastname_error' );
		expect( nameSectionText ).toContain( 'donation_form_lastname_error' );

		const addressSectionText = wrapper.find( '.address-section' ).text();
		expect( addressSectionText ).toContain( 'donation_form_street_error' );
		expect( addressSectionText ).toContain( 'donation_form_zip_error' );
		expect( addressSectionText ).toContain( 'donation_form_city_error' );

		expect( wrapper.find( '.form-field-email .is-danger' ).exists() ).toBe( true );
	} );

	it( 'shows error summary when there are validation errors', async () => {
		const store = createStore();
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( inValidAddress, AddressTypeModel.ANON )
		);

		const wrapper = getWrapper( store, bankTransferConfirmationData );

		await wrapper.find( '#addressType-0' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
	} );

	it( 'shows and hides the error summary', async () => {
		jest.useFakeTimers();

		const store = createStore();
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( inValidAddress, AddressTypeModel.ANON )
		);

		const wrapper = getWrapper( store, bankTransferConfirmationData );

		await wrapper.find( '#addressType-0' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#salutation-0' ).trigger( 'change' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#post-code' ).setValue( '14059' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );

		await wrapper.find( '#country' ).setValue( 'Deutschland' );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();

		jest.restoreAllMocks();
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
		await flushPromises();

		expect( wrapper.find( '.server-message' ).exists() ).toBe( true );
		expect( wrapper.find( '.server-message' ).text() ).toStrictEqual( error );
	} );

	test.each( [
		[ AddressTypeModel.PERSON ],
		[ AddressTypeModel.EMAIL ],
		[ AddressTypeModel.ANON ],
	] )( 'shows and validates as person when initial address type is %s', async ( addressType: AddressTypeModel ) => {
		const store = createStore();
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( emptyAddress, addressType )
		);

		const wrapper = getWrapper( store, bankTransferConfirmationData );

		expect( wrapper.find( '#salutation-0' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#title' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#first-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#last-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#street' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#post-code' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#city' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#country' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#email' ).exists() ).toBeTruthy();

		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#salutation-0"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#first-name"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#last-name"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#street"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#post-code"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#city"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#country"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#email"]' ).exists() ).toBeTruthy();
	} );

	it( 'shows and validates as company when address type is company', async () => {
		const store = createStore();
		emptyAddress.addressType = 'firma';
		await store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			addressData( emptyAddress, AddressTypeModel.COMPANY )
		);

		const wrapper = getWrapper( store, bankTransferConfirmationData );

		expect( wrapper.find( '#company-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#street' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#city' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#country' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#email' ).exists() ).toBeTruthy();

		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#company-name"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#street"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#city"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#country"]' ).exists() ).toBeTruthy();
		expect( wrapper.find( '[href="#email"]' ).exists() ).toBeTruthy();
	} );
} );
