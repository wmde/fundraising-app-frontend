import { mount, VueWrapper } from '@vue/test-utils';
import PaymentType from '@src/components/pages/donation_form/PaymentType.vue';
import { nextTick } from 'vue';

const testPaymentMethods = [ 'BEZ', 'PPL', 'UEB' ];

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

		await wrapper.find( '#payment-ueb input' ).trigger( 'change' );

		expect( wrapper.emitted( 'payment-type-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'payment-type-selected' )![ 0 ] ).toEqual( [ 'UEB' ] );
	} );

	it( 'updates the selected type when the property changes', async () => {
		const wrapper = getWrapper();
		const pplInput = wrapper.find<HTMLInputElement>( '#payment-ppl input' );

		// Check that PPL is not checked by default, because we passed empty props
		expect( pplInput.element.checked ).toBeFalsy();

		// explicitly simulate a prop change from the parent of the wrapper
		await wrapper.setProps( { currentType: 'PPL' } );
		await nextTick();

		expect( pplInput.element.checked ).toBeTruthy();
	} );

} );
