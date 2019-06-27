import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import DonationForm from '@/components/pages/DonationForm.vue';

declare global {
	namespace NodeJS {
		interface Global {
			window: Window;
		}
	}
}
describe( 'DonationForm', () => {
	let wrapper: any;
	beforeEach( () => {
		global.window.scrollTo = jest.fn();
		const localVue = createLocalVue();
		localVue.use( Vuex );
		localVue.use( Buefy );
		wrapper = mount( DonationForm, {
			localVue,
			propsData: {
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
				validateAmountUrl: 'https://example.com/amount-check',
				validateAddressUrl: 'https://example.com/address-check',
				addressCountries: [ 'DE' ],
				trackingData: { bannerImpressionCount: 0, impressionCount: 0 },
			},
			store: new Vuex.Store( {} ),
			mocks: {
				$t: jest.fn(),
			},
			stubs: {
				PaymentPage: '<div class="i-am-payment" />',
				AddressPage: '<div class="i-am-address-form" />',
			},
		} );
	} );

	it( 'displays Payment page by default ', () => {
		expect( wrapper.contains( '.i-am-payment' ) ).toBe( true );
	} );

	it( 'loads Address page when next-page is triggered', () => {
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		expect( wrapper.contains( '.i-am-address-form' ) ).toBe( true );
	} );

	it( 'loads Payment component on the previous page', () => {
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		expect( wrapper.contains( '.i-am-payment' ) ).toBe( true );
	} );

	it( 'does not overshoot the first or last page when multiple page change events trigger', () => {
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		wrapper.vm.$refs.currentPage.$emit( 'next-page' );
		expect( wrapper.contains( '.i-am-address-form' ) ).toBe( true );

		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		expect( wrapper.contains( '.i-am-payment' ) ).toBe( true );

		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		wrapper.vm.$refs.currentPage.$emit( 'previous-page' );
		expect( wrapper.contains( '.i-am-payment' ) ).toBe( true );
	} );

} );
