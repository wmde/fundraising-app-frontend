import { mount } from '@vue/test-utils';
import DonationForm from '@src/components/pages/DonationForm.vue';
import countries from '@src/../tests/data/countries';

declare global {
	namespace NodeJS {
		interface Global {
			window: Window;
		}
	}
}
describe( 'DonationForm.vue', () => {
	let wrapper: any;
	beforeEach( () => {
		global.window.scrollTo = jest.fn();
		wrapper = mount( DonationForm, {
			props: {
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
				validateAddressUrl: 'https://example.com/address-check',
				countries: countries,
				trackingData: { bannerImpressionCount: 0, impressionCount: 0 },
				campaignValues: { campaign: 'nicholas', keyword: 'cage' },
			},
			global: {
				stubs: {
					PaymentPage: { template: '<div class="i-am-payment" />' },
					AddressPage: { template: '<div class="i-am-address-form" />' },
				},
			},
		} );
	} );

	it( 'displays Payment page by default ', () => {
		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

	it( 'loads Address page when next-page is triggered', async () => {
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		await wrapper.vm.$nextTick();
		expect( wrapper.find( '.i-am-address-form' ).exists() ).toBe( true );
	} );

	it( 'loads Payment component on the previous page', () => {
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

	it( 'does not overshoot the first or last page when multiple page change events trigger', async () => {
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		await wrapper.vm.$nextTick();
		expect( wrapper.find( '.i-am-address-form' ).exists() ).toBe( true );

		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		await wrapper.vm.$nextTick();
		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );

		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		await wrapper.vm.$nextTick();
		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

} );
