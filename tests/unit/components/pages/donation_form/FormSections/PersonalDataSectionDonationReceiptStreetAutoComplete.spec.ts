import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import { action } from '@src/store/util';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import { Store } from 'vuex';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import PersonalDataSectionDonationReceipt from '@src/components/pages/donation_form/FormSections/PersonalDataSectionDonationReceipt.vue';
import { FakeBankValidationResource } from '@test/unit/TestDoubles/FakeBankValidationResource';

const testCountry = {
	countryCode: 'de',
	countryFullName: 'Germany',
	group: '',
	postCodeValidation: '',
};

const salutations: Salutation[] = [
	{
		label: 'Herr',
		value: 'Herr',
		display: 'Herr',
		greetings: {
			formal: 'Herr',
			informal: 'Herr',
			lastNameInformal: 'Herr',
		},
	},
];

describe( 'PersonalDataSectionDonationReceipt.vue (With Street Autocomplete)', () => {
	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( PersonalDataSectionDonationReceipt, {
			props: {
				assetsPath: '',
				validateAddressUrl: '',
				validateEmailUrl: '',
				validateBankDataUrl: 'https://localhost:8082',
				validateLegacyBankDataUrl: 'https://localhost:8082',
				countries: [ testCountry ],
				salutations,
				trackingData: {} as TrackingData,
				campaignValues: {} as CampaignValues,
				addressValidationPatterns: { postcode: '' } as AddressValidation,
			},
			global: {
				plugins: [ store ],
				stubs: {
					Address: true,
				},
				provide: {
					bankValidationResource: new FakeBankValidationResource(),
				},
				components: {
					FeatureToggle: createFeatureToggle( [
						'campaigns.address_type_steps.preselect',
						'campaigns.address_field_order.new_order',
					] ),
				},
			},
		} );

		return { wrapper, store };
	};

	it( 'scrolls to payment section when button for changing payment data is clicked', async () => {
		const scrollElement = { scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => scrollElement } );

		const { wrapper } = getWrapper();

		await wrapper.find( '#previous-btn' ).trigger( 'click' );

		expect( scrollElement.scrollIntoView ).toHaveBeenCalledWith( { behavior: 'smooth' } );
	} );

	it( 'validates the payment section input on page submit', async () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn().mockResolvedValue( true );

		await wrapper.find( '#donation-form' ).trigger( 'submit' );

		expect( store.dispatch ).toHaveBeenCalledWith( action( 'payment', 'markEmptyValuesAsInvalid' ) );
	} );
} );
