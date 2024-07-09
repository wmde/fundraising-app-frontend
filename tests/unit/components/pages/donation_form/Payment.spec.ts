import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import { action } from '@src/store/util';

import Payment from '@src/components/pages/donation_form/Payment.vue';
import { NS_PAYMENT } from '@src/store/namespaces';
import { setType } from '@src/store/payment/actionTypes';
import { Store } from 'vuex';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import { nextTick } from 'vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';

describe( 'Payment.vue', () => {
	let store: Store<any>;

	const getWrapper = (): VueWrapper<any> => {
		store = createStore();
		return mount( Payment, {
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

	it( 'sends amount to store when amount model updates', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();
		const payload = '1500';

		wrapper.findComponent( AmountField ).vm.$emit( 'update:modelValue', payload );
		await nextTick();

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, 'setAmount' ), payload );
	} );

	it( 'sends interval to store when interval model updates', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();

		wrapper.findAllComponents( RadioField )[ 0 ].vm.$emit( 'update:modelValue', 6 );
		await nextTick();

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, 'setInterval' ), 6 );
	} );

	it( 'sends payment type to store when payment model updates', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();

		wrapper.findAllComponents( RadioField )[ 1 ].vm.$emit( 'update:modelValue', 'PPL' );
		await nextTick();

		expect( store.dispatch ).toBeCalledWith( action( NS_PAYMENT, setType ), 'PPL' );
	} );

} );
