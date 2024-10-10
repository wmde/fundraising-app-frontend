import { mount, VueWrapper } from '@vue/test-utils';
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
import PersonalDataSection from '@src/components/pages/donation_form/singlePageFormSections/PersonalDataSection.vue';
import { FakeBankValidationResource } from '@test/unit/TestDoubles/FakeBankValidationResource';
import BankFields from '@src/components/shared/BankFields.vue';

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

describe( 'PersonalDataSection.vue', () => {
	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( PersonalDataSection, {
			props: {
				assetsPath: '',
				validateAddressUrl: 'https://localhost:8082',
				validateEmailUrl: 'https://localhost:8082',
				validateBankDataUrl: 'https://localhost:8082',
				validateLegacyBankDataUrl: 'https://localhost:8082',
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
					FeatureToggle: createFeatureToggle( [ 'campaigns.address_type_steps.preselect' ] ),
				},
			},
		} );

		return { wrapper, store };
	};

	const setPaymentTypeAndInitializeOtherPaymentValues = ( store: Store<any>, paymentType: string ): Promise<any> => {
		return store.dispatch( action( 'payment', 'initializePayment' ), {
			allowedIntervals: [ 0 ],
			allowedPaymentTypes: [ paymentType ],
			initialValues: {
				amount: '100',
				type: paymentType,
				paymentIntervalInMonths: '0',
				isCustomAmount: false,
			},
		} );
	};

	it( 'shows bank data fields if payment type is direct debit', async () => {
		const { wrapper, store } = getWrapper();

		expect( wrapper.findComponent( BankFields ).exists() ).toBeFalsy();

		await setPaymentTypeAndInitializeOtherPaymentValues( store, 'BEZ' );

		expect( wrapper.findComponent( BankFields ).exists() ).toBeTruthy();
	} );

	it( 'hides bank data fields if payment type is not direct debit', async () => {
		const { wrapper, store } = getWrapper();

		await setPaymentTypeAndInitializeOtherPaymentValues( store, 'BEZ' );

		expect( wrapper.findComponent( BankFields ).exists() ).toBeTruthy();

		await setPaymentTypeAndInitializeOtherPaymentValues( store, 'UEB' );

		expect( wrapper.findComponent( BankFields ).exists() ).toBeFalsy();
	} );

	it( 'sets address type in store when it receives address-type event', () => {
		const { wrapper, store } = getWrapper();

		store.dispatch = jest.fn();
		const expectedAction = action( 'address', 'setAddressType' );
		const expectedPayload = AddressTypeModel.ANON;

		wrapper.findComponent( AddressTypeBasic ).vm.$emit( 'address-type', AddressTypeModel.ANON );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'scrolls to payment section when button for changing payment data is clicked', async () => {
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
