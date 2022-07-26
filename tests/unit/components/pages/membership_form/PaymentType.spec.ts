import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import PaymentType from '@/components/pages/membership_form/PaymentType.vue';
import { createStore } from '@/store/membership_store';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );

const testPaymentMethods = [ 'BEZ', 'UEB' ];

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

		await wrapper.find( '#payment-bez input' ).trigger( 'change' );

		expect( wrapper.emitted( 'payment-type-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'payment-type-selected' )![ 0 ] ).toEqual( [ 'BEZ' ] );
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

		// explicitly simulate a prop change from outside of the wrapper
		wrapper.setProps( { currentType: 'PPL' } );
		await wrapper.vm.$nextTick();
		expect( wrapper.vm.$data.selectedType ).toBe( 'PPL' );
	} );

} );
