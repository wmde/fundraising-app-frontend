import { mount } from '@vue/test-utils';
import ReceiptOption from '@src/components/shared/ReceiptOption.vue';

describe( 'ReceiptOption.vue', () => {

	it( 'receipt checkbox reflects initial receipt needed state', () => {
		const wrapper = mount( ReceiptOption, {
			props: {
				message: '',
				initialReceiptNeeded: true,
			},
		} );
		const checkBox = wrapper.find<HTMLInputElement>( '#donation_receipt input' );

		expect( checkBox.element.checked ).toBe( true );
	} );

	it( 'emits receipt-changed event on change', async () => {
		const wrapper = mount( ReceiptOption, {
				props: {
					message: '',
					initialReceiptNeeded: true,
				},
			} ),
			event = 'receipt-changed',
			checkBox = wrapper.find( '#donation_receipt input' );
		await checkBox.setValue( false );
		await checkBox.setValue( true );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ false ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ true ] );
	} );

} );
