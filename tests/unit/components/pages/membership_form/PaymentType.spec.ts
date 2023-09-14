import { mount, VueWrapper } from '@vue/test-utils';
import PaymentType from '@src/components/pages/membership_form/PaymentType.vue';
import { nextTick } from 'vue';

const testPaymentMethods = [ 'BEZ', 'UEB' ];

describe( 'PaymentType.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( PaymentType, {
			props: {
				paymentTypes: testPaymentMethods,
			},
		} );
	};

	it( 'emits new payment type when it is selected', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#payment-bez input' ).trigger( 'change' );

		expect( wrapper.emitted( 'payment-type-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'payment-type-selected' )![ 0 ] ).toEqual( [ 'BEZ' ] );
	} );

	it( 'updates the selected type when the property changes', async () => {
		const wrapper = getWrapper();

		const input = wrapper.find<HTMLInputElement>( '#payment-ueb input' );

		// Check that PPL is not checked by default, because we passed empty props
		// Setting the v-model on a radio doesn't seem to update the checked attribute so check for the is-active class
		expect( input.element.checked ).toBeFalsy();

		// explicitly simulate a prop change from the parent of the wrapper
		await wrapper.setProps( { currentType: 'UEB' } );
		await nextTick();

		expect( input.element.checked ).toBeTruthy();
	} );

} );
