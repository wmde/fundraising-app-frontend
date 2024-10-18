import { mount, VueWrapper } from '@vue/test-utils';

import PersonalDataSection from '@src/components/pages/donation_form/FormSections/PersonalDataSection.vue';
import { createStore } from '@src/store/donation_store';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import { Store } from 'vuex';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressValidation } from '@src/view_models/Validation';
import { nextTick } from 'vue';
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import { Salutation } from '@src/view_models/Salutation';
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

describe( 'PersonalDataSection.vue (With Street Autocomplete)', () => {
	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( PersonalDataSection, {
			props: {
				assetsPath: '',
				validateAddressUrl: '',
				validateEmailUrl: '',
				validateBankDataUrl: '',
				validateLegacyBankDataUrl: '',
				countries: [ testCountry ],
				salutations,
				trackingData: {} as TrackingData,
				campaignValues: {} as CampaignValues,
				addressValidationPatterns: { postcode: '', country: null } as AddressValidation,
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

	it( 'sets address type in store when it receives address-type event', () => {
		const { wrapper, store } = getWrapper();

		store.dispatch = jest.fn();
		const expectedAction = action( 'address', 'setAddressType' );
		const expectedPayload = AddressTypeModel.ANON;

		wrapper.findComponent( AddressTypeBasic ).vm.$emit( 'address-type', AddressTypeModel.ANON );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'scrolls to top when the donor clicks the previous button', async () => {
		const scrollElement = { scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => scrollElement } );

		const { wrapper } = getWrapper();

		await wrapper.find( '#previous-btn' ).trigger( 'click' );

		expect( scrollElement.scrollIntoView ).toHaveBeenCalledWith( { behavior: 'smooth' } );
	} );

	it( 'updates full selected', async () => {
		const { wrapper } = getWrapper();

		wrapper.findComponent( AddressTypeBasic ).vm.$emit( 'address-type', AddressTypeModel.PERSON );
		wrapper.findComponent( AddressTypeBasic ).vm.$emit( 'set-full-selected' );
		await nextTick();

		expect( wrapper.find( '.address-type-person' ).exists() ).toBeTruthy();
	} );

	it( 'validates the payment section input on page submit', async () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn().mockResolvedValue( true );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		expect( store.dispatch ).toHaveBeenCalledWith( action( 'payment', 'markEmptyValuesAsInvalid' ) );
	} );
} );
