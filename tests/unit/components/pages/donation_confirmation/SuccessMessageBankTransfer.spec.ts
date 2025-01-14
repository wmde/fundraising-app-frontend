import { testBankTransferCode } from '@test/data/confirmationData';
import { mount, VueWrapper } from '@vue/test-utils';
import SuccessMessageBankTransfer from '@src/components/pages/donation_confirmation/SuccessMessageBankTransfer.vue';
import { Donation } from '@src/view_models/Donation';

describe( 'SuccessMessageBankTransfer.vue', () => {
	let testDonation: Donation;

	beforeEach( () => {
		testDonation = {
			paymentType: 'UEB',
			bankTransferCode: testBankTransferCode,
			amount: 12.35,
			newsletter: true,
		} as object as Donation;
	} );

	const getWrapper = ( donation: Donation ): VueWrapper<any> => {
		return mount( SuccessMessageBankTransfer, {
			props: {
				donation,
			},
			global: {
				mocks: {
					$t: ( key: string ) => key,
				},
			},
		} );
	};

	it( 'renders messages', () => {
		const wrapper = getWrapper( testDonation );

		expect( wrapper.text() ).toContain( 'donation_confirmation_topbox_payment_title_bank_transfer_alt' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_payment_bank_transfer' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_reminder_bank_transfer' );
	} );

	it( 'displays bank data', () => {
		const wrapper = getWrapper( testDonation );

		expect( wrapper.find( '.success-message-bank-transfer .bank-data-content' ).html() ).toContain( testBankTransferCode );
	} );

	it( 'does not render newsletter confirmation message when opted out', () => {
		testDonation.newsletter = false;
		const wrapper = getWrapper( testDonation );

		expect( wrapper.text() ).not.toContain( 'donation_confirmation_newsletter_confirmation' );
	} );

	it( 'renders newsletter confirmation message when user activated newsletter option', () => {
		testDonation.newsletter = true;
		const wrapper = getWrapper( testDonation );

		expect( wrapper.text() ).toContain( 'donation_confirmation_newsletter_confirmation' );
	} );
} );
