import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import { action } from '@src/store/util';

import Payment from '@src/components/pages/donation_form/Payment.vue';
import { NS_PAYMENT } from '@src/store/namespaces';
import { setAmount, setInterval, setType } from '@src/store/payment/actionTypes';
import PaymentInterval from '@src/components/shared/PaymentInterval.vue';
import AmountSelection from '@src/components/shared/AmountSelection.vue';
import PaymentType from '@src/components/pages/donation_form/PaymentType.vue';
import { Store } from 'vuex';

describe( 'Payment.vue', () => {
	let store: Store<any>;

	const getWrapper = (): VueWrapper<any> => {
		store = createStore();
		return shallowMount( Payment, {
			props: {
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'sends amount to store when amount selection emits event ', () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();
		const payload = '1500';

		wrapper.findComponent( AmountSelection ).vm.$emit( 'amount-selected', payload );

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, setAmount ), payload );
	} );

	it( 'sends interval to store when interval selection emits event ', () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();

		wrapper.findComponent( PaymentInterval ).vm.$emit( 'interval-selected', 6 );

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, setInterval ), 6 );
	} );

	it( 'sends payment type to store when payment selection emits event ', () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();

		wrapper.findComponent( PaymentType ).vm.$emit( 'payment-type-selected', 'PPL' );

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, setType ), 'PPL' );
	} );
} );
