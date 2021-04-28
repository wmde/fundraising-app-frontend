import { mount, createLocalVue } from '@vue/test-utils';
import ReceiptOptOut from '@/components/shared/ReceiptOptOut.vue';
import Buefy from 'buefy';

const localVue = createLocalVue();
localVue.use( Buefy );

describe( 'ReceiptOptOut', () => {

	it( 'receipt checkbox is checked on initial render and can be opted-out from', () => {
		const wrapper = mount( ReceiptOptOut, {
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

	// See https://phabricator.wikimedia.org/T281373
	xit( 'emits opt out event on change', async () => {
		const wrapper = mount( ReceiptOptOut, {
				localVue,
				propsData: {
					initialReceiptNeeded: true,
				},
				mocks: {
					$t: () => { },
				},
			} ),
			event = 'opted-out',
			checkBox = wrapper.find( '#donation_receipt' );
		// Triggering click does not change the internal value of the Buefy checkbox
		await checkBox.trigger( 'click' );
		await checkBox.trigger( 'click' );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ true ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ false ] );
	} );

} );
