import { createLocalVue, mount } from '@vue/test-utils';
import AddressAnonymous from '@/components/pages/donation_confirmation/AddressAnonymous.vue';
import { createStore } from '@/store/donation_store';
import Buefy from 'buefy';

const localVue = createLocalVue();
localVue.use( Buefy );

describe( 'AddressAnonymous', () => {
	it( 'renders messages', () => {
		const wrapper = mount( AddressAnonymous, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_cta_title_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_cta_summary_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_address_update_button_alt' );
	} );

	it( 'emits event when update address link is clicked', () => {
		const wrapper = mount( AddressAnonymous, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		wrapper.find( '#address-change-button' ).trigger( 'click' );

		expect( wrapper.emitted( 'show-address-modal' ) ).toBeTruthy();
	} );
} );
