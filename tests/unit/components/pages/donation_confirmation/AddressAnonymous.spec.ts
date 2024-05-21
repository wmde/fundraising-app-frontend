import { mount, VueWrapper } from '@vue/test-utils';
import AddressAnonymous from '@src/components/pages/donation_confirmation/AddressAnonymous.vue';

describe( 'AddressAnonymous', () => {
	function getWrapper(): VueWrapper<any> {
		return mount(
			AddressAnonymous,
			{
				props: {
					modalIsVisible: false,
				},
			}
		);
	}

	it( 'renders messages', () => {
		const wrapper = getWrapper();

		expect( wrapper.text() ).toContain( 'donation_confirmation_cta_title_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_cta_summary_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_address_update_button_alt' );
	} );

	it( 'emits event when update address link is clicked', () => {
		const wrapper = getWrapper();

		wrapper.find( '#address-change-button' ).trigger( 'click' );

		expect( wrapper.emitted( 'show-address-modal' ) ).toBeTruthy();
	} );
} );
