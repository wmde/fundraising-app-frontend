import { mount, VueWrapper } from '@vue/test-utils';
import UpdateAddress from '@src/components/pages/UpdateAddress.vue';
import { EXAMPLE_SALUTATIONS } from '@test/unit/components/pages/donation_form/AddressForms.spec';
import countries from '@src/../tests/data/countries';
import { addressValidationPatterns } from '@test/data/validation';
import { Store } from 'vuex';
import { createStore } from '@src/store/update_address_store';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { initializeAddress } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { nextTick } from 'vue';

jest.mock( '@src/util/tracking', () => {
	return {
		trackFormSubmission: jest.fn(),
	};
} );

describe( 'UpdateAddress.vue', () => {

	const getWrapper = ( store: Store<any> = createStore() ): VueWrapper<any> => {
		return mount( UpdateAddress, {
			props: {
				validateAddressUrl: '',
				updateAddressURL: '',
				countries,
				salutations: EXAMPLE_SALUTATIONS,
				addressValidationPatterns,
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'Shows person form fields', async () => {
		const store = createStore();
		await store.dispatch( action( NS_ADDRESS, initializeAddress ), { addressType: AddressTypeModel.PERSON, fields: [] } );

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
		await store.dispatch( action( NS_ADDRESS, initializeAddress ), { addressType: AddressTypeModel.COMPANY, fields: [] } );

		const wrapper = getWrapper( store );

		expect( wrapper.find( '#company-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#street' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#post-code' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#city' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#country' ).exists() ).toBeTruthy();
	} );

	it( 'shows and hides the error summary', async () => {
		const store = createStore();
		await store.dispatch( action( NS_ADDRESS, initializeAddress ), { addressType: AddressTypeModel.COMPANY, fields: [] } );
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

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );
} );
