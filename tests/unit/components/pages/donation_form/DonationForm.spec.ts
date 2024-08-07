import { mount, VueWrapper } from '@vue/test-utils';
import DonationForm from '@src/components/pages/DonationForm.vue';
import countries from '@src/../tests/data/countries';
import { AddressValidation } from '@src/view_models/Validation';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import PaymentPage from '@test/data/DonationFormPages/PaymentPageStub.vue';
import AddressPage from '@test/data/DonationFormPages/AddressPageStub.vue';
import { nextTick } from 'vue';

declare global {
	namespace NodeJS {
		interface Global {
			window: Window;
		}
	}
}

describe( 'DonationForm.vue', () => {

	beforeEach( () => {
		global.window.scrollTo = jest.fn();
	} );

	const getWrapper = ( startPageIndex: 0 | 1 = 0 ): VueWrapper<any> => {
		return mount( DonationForm, {
			props: {
				assetsPath: '',
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
				validateAddressUrl: 'https://example.com/address-check',
				countries: countries,
				trackingData: { bannerImpressionCount: 0, impressionCount: 0 },
				campaignValues: { campaign: 'nicholas', keyword: 'cage' },
				validateEmailUrl: '',
				validateBankDataUrl: '',
				validateLegacyBankDataUrl: '',
				salutations: [],
				addressValidationPatterns: {} as AddressValidation,
				startPageIndex,
			},
			global: {
				stubs: {
					PaymentPage,
					AddressPage,
				},
				components: {
					FeatureToggle: createFeatureToggle( [ 'campaigns.address_pages.legacy' ] ),
				},
			},
		} );
	};

	it( 'displays Payment page by default ', () => {
		const wrapper = getWrapper( 0 );
		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

	it( 'loads Address page when next-page is triggered', async () => {
		const wrapper = getWrapper( 0 );
		await wrapper.findComponent( PaymentPage ).vm.$emit( 'next-page' );

		expect( wrapper.find( '.i-am-address-form' ).exists() ).toBe( true );
	} );

	it( 'loads Payment component on the previous page', async () => {
		const wrapper = getWrapper( 1 );

		await wrapper.findComponent( AddressPage ).vm.$emit( 'previous-page' );

		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

	it( 'does not overshoot the first or last page when multiple page change events trigger', async () => {
		const wrapper = getWrapper( 0 );

		const paymentPage = wrapper.findComponent( PaymentPage );

		paymentPage.vm.$emit( 'next-page' );
		await nextTick();

		expect( wrapper.find( '.i-am-address-form' ).exists() ).toBe( true );

		const addressPage = wrapper.findComponent( AddressPage );

		addressPage.vm.$emit( 'previous-page' );
		await nextTick();

		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

	it( 'scrolls to top of page only when page index changes', async () => {
		const wrapper = getWrapper( 0 );

		const paymentPage = wrapper.findComponent( PaymentPage );
		paymentPage.vm.$emit( 'next-page' );
		await nextTick();

		const addressPage = wrapper.findComponent( AddressPage );
		addressPage.vm.$emit( 'previous-page' );
		await nextTick();

		expect( global.window.scrollTo ).toHaveBeenCalledTimes( 2 );
	} );

} );
