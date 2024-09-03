import { mount, VueWrapper } from '@vue/test-utils';
import SinglePageDonationForm from '@src/components/pages/SinglePageDonationForm.vue';
import countries from '@src/../tests/data/countries';
import { AddressValidation } from '@src/view_models/Validation';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import PaymentSection from '@src/components/pages/donation_form/singlePageFromSections/PaymentSection.vue';
import PersonalDataSection from '@src/components/pages/donation_form/singlePageFromSections/PersonalDataSection.vue';
import { Store } from 'vuex';
import { createStore, StoreKey } from '@src/store/donation_store';

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

	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( SinglePageDonationForm, {
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
				usesContentCards: true,
			},
			global: {
				plugins: [ store ],
				provide: {
					[ StoreKey as symbol ]: store,
				},
				components: {
					FeatureToggle: createFeatureToggle( [ 'campaigns.address_pages.legacy' ] ),
				},
			},
		} );
		return { wrapper, store };
	};

	it( 'displays payment section and address data section', () => {
		const wrapper = getWrapper().wrapper;
		expect( wrapper.findComponent( PaymentSection ).exists() ).toBe( true );
		expect( wrapper.findComponent( PersonalDataSection ).exists() ).toBe( true );
	} );
} );
