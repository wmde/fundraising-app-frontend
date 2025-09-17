import { mount } from '@vue/test-utils';
import SubscriptionConfirmation from '@src/components/pages/SubscriptionConfirmation.vue';

describe( 'SubscriptionConfirmation.vue', () => {
	it( 'renders success message by default (when there is no error)', () => {
		const wrapper = mount( SubscriptionConfirmation );
		expect( wrapper.find( '.success-message' ).exists() ).toBe( true );
	} );

	it( 'renders success message when the error is "subscription was already confirmed.")', () => {
		const wrapper = mount( SubscriptionConfirmation, {
			props: {
				errorMessage: 'subscription_already_confirmed',
			},
		} );
		expect( wrapper.find( '.success-message' ).exists() ).toBe( true );
	} );

	it( 'renders error message', () => {
		const wrapper = mount( SubscriptionConfirmation, {
			props: {
				errorMessage: 'any error',
			},
		} );
		const errorMessage = wrapper.find( '.error-message' );
		expect( errorMessage.exists() ).toBe( true );
		expect( errorMessage.text() ).toBe( 'any error' );
		expect( wrapper.find( '.success-message' ).exists() ).toBe( false );
	} );
} );
