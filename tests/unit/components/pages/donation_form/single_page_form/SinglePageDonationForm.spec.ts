import { mount, VueWrapper } from '@vue/test-utils';
import SinglePageDonationForm from '@src/components/pages/SinglePageDonationForm.vue';
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

describe( 'SinglePageDonationForm.vue', () => {

	beforeEach( () => {
		global.window.scrollTo = jest.fn();
	} );

	const getWrapper = ( startPageIndex: 0 | 1 = 0 ): VueWrapper<any> => {
		return mount( SinglePageDonationForm, {
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

	it( 'displays payment section and address data section', () => {
	} );

	it( 'displays Payment page by default ', () => {
		const wrapper = getWrapper( 0 );
		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );


} );
