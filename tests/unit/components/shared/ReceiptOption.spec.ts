import { mount, createLocalVue } from '@vue/test-utils';
import ReceiptOption from '../../../../src/components/shared/ReceiptOption.vue';

const localVue = createLocalVue();

describe( 'ReceiptOption', () => {

	it( 'receipt checkbox reflects initial receipt needed state', () => {
		const wrapper = mount( ReceiptOption, {
				localVue,
				propsData: {
					initialReceiptNeeded: true,
				},
				mocks: {
					$t: () => { },
				},
			} ),
			checkBox = wrapper.find( '#donation_receipt' );

		expect( checkBox.props().value ).toBe( true );
	} );

	it( 'emits receipt-changed event on change', async () => {
		const wrapper = mount( ReceiptOption, {
				localVue,
				propsData: {
					initialReceiptNeeded: true,
				},
				mocks: {
					$t: () => { },
				},
			} ),
			event = 'receipt-changed',
			checkBox = wrapper.find( '#donation_receipt input' );
		await checkBox.setChecked( false );
		await checkBox.setChecked( true );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ false ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ true ] );
	} );

} );
