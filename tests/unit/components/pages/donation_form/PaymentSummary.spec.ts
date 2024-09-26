import { mount } from '@vue/test-utils';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';

describe( 'PaymentSummary.vue', () => {
	it( 'renders the payment summary with paymentType', () => {
		const wrapper = mount( PaymentSummary, {
			props: {
				amount: 50,
				interval: 'monthly',
				paymentType: 'Credit Card',
			},
		} );

		expect( wrapper.find( '.payment-summary-text' ).html() ).toContain(
			'donation_form_payment_summary'
		);
	} );

	it( 'renders the payment summary with paymentType', () => {
		const wrapper = mount( PaymentSummary, {
			props: {
				amount: 41.3,
				interval: 'yearly',
			},
		} );

		expect( wrapper.find( '.payment-summary-text' ).html() ).toContain(
			'donation_form_payment_summary_payment_type_missing'
		);
	} );
} );
