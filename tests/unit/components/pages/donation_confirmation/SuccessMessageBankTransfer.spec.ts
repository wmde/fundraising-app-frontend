import {
	bankTransferConfirmationData,
	payPalConfirmationData,
	testBankTransferCode,
} from '../../../../data/confirmationData';
import { createLocalVue, mount } from '@vue/test-utils';
import { createStore } from '@/store/donation_store';
import SuccessMessageBankTransfer from '@/components/pages/donation_confirmation/SuccessMessageBankTransfer.vue';

const localVue = createLocalVue();

describe( 'SuccessMessageBankTransfer', () => {
	it( 'renders messages', () => {
		const wrapper = mount( SuccessMessageBankTransfer, {
			localVue,
			propsData: {
				donation: bankTransferConfirmationData.donation,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_topbox_payment_title_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_payment_bank_transfer_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_reminder_bank_transfer' );
	} );

	it( 'displays bank data', () => {
		const wrapper = mount( SuccessMessageBankTransfer, {
			localVue,
			propsData: {
				donation: bankTransferConfirmationData.donation,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '.success-message-bank-transfer .bank-data-content' ).html() ).toContain( testBankTransferCode );
	} );

	it( 'does not render newsletter confirmation message when opted out', () => {
		const wrapper = mount( SuccessMessageBankTransfer, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
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
		donation.optsIntoNewsletter = true;

		const wrapper = mount( SuccessMessageBankTransfer, {
			localVue,
			propsData: {
				donation,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_newsletter_confirmation' );
	} );
} );
