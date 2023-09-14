import { mount, VueWrapper } from '@vue/test-utils';
import SuccessMessage from '@src/components/pages/donation_confirmation/SuccessMessage.vue';
import { directDebitConfirmationData, payPalConfirmationData } from '../../../../data/confirmationData';
import { Donation } from '@src/view_models/Donation';

describe( 'SuccessMessage.vue', () => {

	const getWrapper = ( donation: Donation, commentLinkIsDisabled: boolean ): VueWrapper<any> => {
		return mount( SuccessMessage, {
			props: {
				donation,
				commentLinkIsDisabled,
			},
			global: {
				mocks: {
					$t: ( key: string ) => key,
					$n: () => {},
				},
			},
		} );
	};

	it( 'renders messages', () => {
		const wrapper = getWrapper( payPalConfirmationData.donation, true );

		expect( wrapper.text() ).toContain( 'donation_confirmation_topbox_payment_title_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_inline_summary' );
	} );

	it( 'does not render newsletter confirmation message when opted out', () => {
		const wrapper = getWrapper( payPalConfirmationData.donation, true );

		expect( wrapper.text() ).not.toContain( 'donation_confirmation_newsletter_confirmation' );
	} );

	it( 'renders newsletter confirmation message when opted in', () => {
		let donation = payPalConfirmationData.donation;
		donation.newsletter = true;

		const wrapper = getWrapper( donation, true );

		expect( wrapper.text() ).toContain( 'donation_confirmation_newsletter_confirmation' );
	} );

	it( 'does not render direct debit message when payment type is not BEZ', () => {
		const wrapper = getWrapper( payPalConfirmationData.donation, true );

		expect( wrapper.text() ).not.toContain( 'donation_confirmation_payment_direct_debit' );
	} );

	it( 'renders direct debit message when payment type is BEZ', () => {
		const wrapper = getWrapper( directDebitConfirmationData.donation, true );

		expect( wrapper.text() ).toContain( 'donation_confirmation_payment_direct_debit' );
	} );

	it( 'enables comment link when enabled', () => {
		const wrapper = getWrapper( payPalConfirmationData.donation, false );

		expect( wrapper.find( '.comment-thanks' ).exists() ).toBeFalsy();
		expect( wrapper.find( '#comment-link' ).exists() ).toBeTruthy();
	} );

	it( 'disables comment link when disabled', () => {
		const wrapper = getWrapper( payPalConfirmationData.donation, true );

		expect( wrapper.find( '.comment-thanks' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#comment-link' ).exists() ).toBeFalsy();
	} );

	it( 'emits event when comment link is clicked', () => {
		const wrapper = getWrapper( payPalConfirmationData.donation, false );

		wrapper.find( '#comment-link' ).trigger( 'click' );

		expect( wrapper.emitted( 'show-comment-modal' ) ).toBeTruthy();
	} );
} );
