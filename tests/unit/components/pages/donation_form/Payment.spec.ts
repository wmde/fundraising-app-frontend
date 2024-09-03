import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import { action } from '@src/store/util';

import Payment from '@src/components/pages/donation_form/Payment.vue';
import { Store } from 'vuex';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import { nextTick } from 'vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

describe( 'Payment.vue', () => {
	let store: Store<any>;

	const getWrapper = (): VueWrapper<any> => {
		store = createStore();
		return mount( Payment, {
			props: {
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'SUB', 'BTC' ],
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

		expect( store.dispatch ).toBeCalledWith( action( 'payment', 'setAmount' ), payload );
	} );

	it( 'sends interval to store when interval model updates', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();

		wrapper.findAllComponents( RadioField )[ 0 ].vm.$emit( 'update:modelValue', 6 );
		await nextTick();

		expect( store.dispatch ).toBeCalledWith( action( 'payment', 'setInterval' ), 6 );
	} );

	it( 'sends payment type to store when payment model updates', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();

		wrapper.findAllComponents( RadioField )[ 1 ].vm.$emit( 'update:modelValue', 'PPL' );
		await nextTick();

		expect( store.dispatch ).toBeCalledWith( action( 'payment', 'setType' ), 'PPL' );
	} );

	it( 'renders tooltip hint if SUB payment method is disabled', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#interval-1' ).trigger( 'change' );
		await nextTick();

		expect( wrapper.find( '.radio-field-tooltip' ).isVisible() ).toBe( true );
	} );

	it( 'does not render tooltip hint if SUB payment method is enabled', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#interval-0' ).trigger( 'click' );
		await nextTick();

		expect( wrapper.find( '.radio-field-tooltip' ).exists() ).toBe( false );
	} );

	it( 'renders tooltip hint if address type is Anonymous', async () => {
		const wrapper = getWrapper();

		await store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.ANON );

		expect( wrapper.find( '.radio-field-tooltip' ).isVisible() ).toBe( true );
	} );

	it( 'does not render tooltip hint if address type is something different than Anonymous', async () => {
		const wrapper = getWrapper();

		await store.dispatch( action( 'address', 'setAddressType' ), AddressTypeModel.EMAIL );

		expect( wrapper.find( '.radio-field-tooltip' ).exists() ).toBe( false );
	} );

} );
