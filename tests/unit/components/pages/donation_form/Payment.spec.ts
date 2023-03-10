import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import { createStore } from '@/store/donation_store';
import { action } from '@/store/util';

import Payment from '@/components/pages/donation_form/Payment.vue';
import { NS_PAYMENT } from '@/store/namespaces';
import { setAmount, setInterval, setType } from '@/store/payment/actionTypes';
import PaymentInterval from '@/components/shared/PaymentInterval.vue';
import AmountSelection from '@/components/shared/AmountSelection.vue';
import PaymentType from '@/components/pages/donation_form/PaymentType.vue';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );
localVue.use( FeatureTogglePlugin, { activeFeatures: [ 'campaigns.address_type.preselection' ] } );

describe( 'Payment', () => {
	it( 'sends amount to store when amount selection emits event ', () => {
		const wrapper = shallowMount( Payment, {
			localVue,
			propsData: {
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
			},
			store: createStore(),
			mocks: {
				$t: jest.fn(),
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();
		const payload = '1500';

		wrapper.findComponent( AmountSelection ).vm.$emit( 'amount-selected', payload );

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, setAmount ), payload );
	} );

	it( 'sends interval to store when interval selection emits event ', () => {
		const wrapper = shallowMount( Payment, {
			localVue,
			propsData: {
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
			},
			store: createStore(),
			mocks: {
				$t: jest.fn(),
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		wrapper.findComponent( PaymentInterval ).vm.$emit( 'interval-selected', 6 );

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, setInterval ), 6 );
	} );

	it( 'sends payment type to store when payment selection emits event ', () => {
		const wrapper = shallowMount( Payment, {
			localVue,
			propsData: {
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
			},
			store: createStore(),
			mocks: {
				$t: jest.fn(),
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		wrapper.findComponent( PaymentType ).vm.$emit( 'payment-type-selected', 'PPL' );

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, setType ), 'PPL' );
	} );
} );
