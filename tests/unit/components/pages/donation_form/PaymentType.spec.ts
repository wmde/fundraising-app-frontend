import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import PaymentType from '@/components/pages/donation_form/PaymentType.vue';
import { createStore } from '@/store/donation_store';

const localVue = createLocalVue();
localVue.use( Vuex );

const testPaymentMethods = [ 'BEZ', 'PPL', 'UEB' ];

describe( 'PaymentType', () => {

	it( 'emits new payment type when it is selected', async () => {
		const wrapper = mount( PaymentType, {
			localVue,
			propsData: {
				paymentTypes: testPaymentMethods,
			},
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );

		await wrapper.find( '#payment-ueb input' ).trigger( 'change' );

		expect( wrapper.emitted( 'payment-type-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'payment-type-selected' )![ 0 ] ).toEqual( [ 'UEB' ] );
	} );

	it( 'updates the selected type when the property changes', async () => {
		const wrapper = mount( PaymentType, {
			localVue,
			propsData: {
				paymentTypes: testPaymentMethods,
			},
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );
		const pplInput = await wrapper.find( '#payment-ppl input' );

		// Check that PPL is not checked by default, because we passed empty props
		expect( ( pplInput.element as HTMLInputElement ).checked ).toBeFalsy();

		// explicitly simulate a prop change from the parent of the wrapper
		wrapper.setProps( { currentType: 'PPL' } );
		await wrapper.vm.$nextTick();

		expect( ( pplInput.element as HTMLInputElement ).checked ).toBeTruthy();
	} );

} );
