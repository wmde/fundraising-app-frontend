import { mount, VueWrapper } from '@vue/test-utils';
import axios from 'axios';
import UpdateAddress from '@src/components/pages/UpdateAddress.vue';
import { EXAMPLE_SALUTATIONS } from '@test/unit/components/pages/donation_form/AddressForms.spec';
import countries from '@src/../tests/data/countries';
import { addressValidationPatterns } from '@test/data/validation';
import { Store } from 'vuex';
import { createStore } from '@src/store/update_address_store';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { nextTick } from 'vue';
import { AddressChangeResource } from '@src/api/AddressChangeResource';
import { UpdateAddressResponse } from '@src/api/UpdateAddressResponse';

jest.mock( '@src/util/tracking', () => {
	return {
		trackFormSubmission: jest.fn(),
	};
} );

jest.mock( 'axios' );
const mockedAxios = axios as jest.Mocked<typeof axios>;

const defaultAddressChangeResource: AddressChangeResource = {
	put(): Promise<UpdateAddressResponse> {
		return Promise.resolve( undefined );
	},
};

// This is so the error summary scrollIntoView doesn't throw errors
const errorSummaryScrollElement = { scrollIntoView: () => {} };
Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => errorSummaryScrollElement } );

describe( 'UpdateAddress.vue', () => {

	const getWrapper = ( store: Store<any> = createStore(), addressChangeResource: AddressChangeResource = defaultAddressChangeResource ): VueWrapper<any> => {
		return mount( UpdateAddress, {
			props: {
				validateAddressUrl: '',
				countries,
				salutations: EXAMPLE_SALUTATIONS,
				addressValidationPatterns,
				addressChangeResource,
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'Shows person form fields', async () => {
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), { addressType: AddressTypeModel.PERSON, fields: [] } );

		const wrapper = getWrapper( store );

		expect( wrapper.find( '#salutation-0' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#title' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#first-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#last-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#street' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#post-code' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#city' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#country' ).exists() ).toBeTruthy();
	} );

	it( 'Shows company form fields', async () => {
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), { addressType: AddressTypeModel.COMPANY, fields: [] } );

		const wrapper = getWrapper( store );

		expect( wrapper.find( '#company-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#street' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#post-code' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#city' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#country' ).exists() ).toBeTruthy();
	} );

	it( 'shows and hides the error summary', async () => {
		jest.useFakeTimers();

		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), { addressType: AddressTypeModel.COMPANY, fields: [] } );
		const wrapper = getWrapper( store );

		await wrapper.find( 'form' ).trigger( 'submit' );
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		const company = wrapper.find( '#company-name' );
		const street = wrapper.find( '#street' );
		const postcode = wrapper.find( '#post-code' );
		const city = wrapper.find( '#city' );
		const country = wrapper.find( '#country' );

		await company.setValue( 'company' );
		await company.trigger( 'blur' );
		await street.setValue( 'street' );
		await street.trigger( 'blur' );
		await postcode.setValue( 'postcode' );
		await postcode.trigger( 'blur' );
		await city.setValue( 'city' );
		await city.trigger( 'blur' );
		await country.setValue( 'country' );
		await country.trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();

		jest.restoreAllMocks();
	} );

	it( 'redirects to the success page on successful submit', async () => {
		jest.useFakeTimers();

		mockedAxios.post.mockResolvedValue( { data: { status: 'OK' } } );
		Object.defineProperty( window, 'location', { value: { href: '' }, writable: true } );

		const addressChangeResource: AddressChangeResource = {
			put(): Promise<UpdateAddressResponse> {
				return Promise.resolve( { identifier: 'anything' } as object as UpdateAddressResponse );
			},
		};

		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), { addressType: AddressTypeModel.COMPANY, fields: [] } );
		const wrapper = getWrapper( store, addressChangeResource );

		await wrapper.find( '#company-name' ).setValue( 'company' );
		await wrapper.find( '#company-name' ).trigger( 'blur' );
		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );
		await wrapper.find( '#post-code' ).setValue( '14059' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );
		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );
		await wrapper.find( '#country' ).setValue( 'Deutschland' );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		await wrapper.find( 'form' ).trigger( 'submit' );
		await nextTick();

		expect( window.location.href ).toStrictEqual( '/update-address/success?addressToken=anything' );

		jest.restoreAllMocks();
	} );
} );
