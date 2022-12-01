import { createLocalVue, mount } from '@vue/test-utils';
import { createStore } from '@/store/donation_store';
import SuccessMessage from '@/components/pages/donation_confirmation/SuccessMessage.vue';
import { directDebitConfirmationData, payPalConfirmationData } from '../../../../data/confirmationData';

const localVue = createLocalVue();

describe( 'SuccessMessage', () => {
	it( 'renders messages', () => {
		const wrapper = mount( SuccessMessage, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				commentLinkIsDisabled: true,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_topbox_payment_title_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_inline_summary' );
	} );

	it( 'does not render newsletter confirmation message when opted out', () => {
		const wrapper = mount( SuccessMessage, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				commentLinkIsDisabled: true,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).not.toContain( 'donation_confirmation_newsletter_confirmation' );
	} );

	it( 'renders newsletter confirmation message when opted in', () => {
		let donation = payPalConfirmationData.donation;
		donation.newsletter = true;

		const wrapper = mount( SuccessMessage, {
			localVue,
			propsData: {
				donation,
				commentLinkIsDisabled: true,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_newsletter_confirmation' );
	} );

	it( 'does not render direct debit message when payment type is not BEZ', () => {
		const wrapper = mount( SuccessMessage, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				commentLinkIsDisabled: true,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).not.toContain( 'donation_confirmation_payment_direct_debit' );
	} );

	it( 'renders direct debit message when payment type is BEZ', () => {
		const wrapper = mount( SuccessMessage, {
			localVue,
			propsData: {
				donation: directDebitConfirmationData.donation,
				commentLinkIsDisabled: true,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_payment_direct_debit' );
	} );

	it( 'enables comment link when enabled', () => {
		const wrapper = mount( SuccessMessage, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				commentLinkIsDisabled: false,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '#comment-link' ).element.getAttribute( 'disabled' ) ).toBeFalsy();
	} );

	it( 'disables comment link when disabled', () => {
		const wrapper = mount( SuccessMessage, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				commentLinkIsDisabled: true,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '#comment-link' ).element.getAttribute( 'disabled' ) ).toBeTruthy();
	} );

	it( 'emits event when comment link is clicked', () => {
		const wrapper = mount( SuccessMessage, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				commentLinkIsDisabled: false,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		wrapper.find( '#comment-link' ).trigger( 'click' );

		expect( wrapper.emitted( 'show-comment-modal' ) ).toBeTruthy();
	} );
} );
