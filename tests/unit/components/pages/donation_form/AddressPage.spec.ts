import { createLocalVue, shallowMount } from '@vue/test-utils';

import AddressPage from '@/components/pages/donation_form/subpages/AddressPage.vue';
import Vuex from 'vuex';
import Buefy from 'buefy';
import CompositionAPI from '@vue/composition-api';
import { createStore } from '@/store/donation_store';
import { action } from '@/store/util';
import { NS_ADDRESS, NS_PAYMENT } from '@/store/namespaces';
import { initializePayment } from '@/store/payment/actionTypes';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import PaymentBankData from '@/components/shared/PaymentBankData.vue';
import { setAddressType } from '@/store/address/actionTypes';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import AddressType from '@/components/pages/donation_form/AddressType.vue';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );
localVue.use( CompositionAPI );

localVue.use( FeatureTogglePlugin, { activeFeatures: [
	'campaigns.encryption_hint',
	'campaigns.address_type_steps',
] } );

describe( 'AddressPage', () => {

	let wrapper: any;
	let store: any;

	beforeEach( () => {
		store = createStore();
		wrapper = shallowMount( AddressPage, {
			localVue,
			store,
			propsData: {
			},
			mocks: {
				$t: () => { },
			},
			stubs: {
				Address: true,
			},
		} );
	} );

	it( 'shows bank data fields if payment type is direct debit', async () => {
		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBe( false );

		return store.dispatch( action( NS_PAYMENT, initializePayment ), {
			amount: '100',
			type: 'BEZ',
			paymentIntervalInMonths: '0',
			isCustomAmount: false,
		} ).then( () => {
			expect( wrapper.findComponent( PaymentBankData ).exists() ).toBe( true );
		} );

	} );

	it( 'hides bank data fields if payment type is not direct debit', async () => {
		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBe( false );

		return store.dispatch( action( NS_PAYMENT, initializePayment ), {
			amount: '100',
			type: 'UEB',
			paymentIntervalInMonths: '0',
			isCustomAmount: false,
		} ).then( () => {
			expect( wrapper.findComponent( PaymentBankData ).exists() ).toBe( false );
		} );

	} );

	it( 'sets address type in store when it receives address-type event', () => {
		store.dispatch = jest.fn();
		const expectedAction = action( NS_ADDRESS, setAddressType );
		const expectedPayload = AddressTypeModel.ANON;
		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.ANON );
		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

} );
