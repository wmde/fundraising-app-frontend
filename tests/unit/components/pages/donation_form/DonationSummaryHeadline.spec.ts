import { mount } from '@vue/test-utils';
import DonationSummaryHeadline from '@src/components/pages/donation_form/DonationSummaryHeadline.vue';

describe( 'DonationSummaryHeadline.vue', () => {

	it( 'renders summary headline when amount, interval and payment type is set', async () => {

		const wrapper = mount( DonationSummaryHeadline, {
			props: {
				payment:
					{
						paymentType: 'BEZ',
						interval: 12,
						amount: 14.99,
					},
			},
		} );

		const text = wrapper.text();

		expect( text ).toContain( 'donation_form_summary_headline' );
		expect( text ).toContain( '{"amount":14.99,"key":"currency","currencyDisplay":"name"}' );
		expect( text ).toContain( '{"key":"donation_form_payment_interval_12"}' );
		expect( text ).toContain( 'donation_summary_via {"key":"BEZ"}' );
	} );

	it( 'renders when amount and interval are set and payment type is not selected', async () => {
		const wrapper = mount( DonationSummaryHeadline, {
			props: {
				payment:
					{
						paymentType: '',
						interval: 6,
						amount: 15.99,
					},
			},
		} );

		const text = wrapper.text();

		expect( text ).toContain( 'donation_form_summary_headline' );
		expect( text ).toContain( '{"amount":15.99,"key":"currency","currencyDisplay":"name"}' );
		expect( text ).toContain( '{"key":"donation_form_payment_interval_6"}' );
		expect( text ).not.toContain( 'donation_summary_via {"key":"BEZ"}' );
	} );

} );
