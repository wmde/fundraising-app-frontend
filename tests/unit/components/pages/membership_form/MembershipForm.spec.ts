import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import MembershipForm from '@src/components/pages/MembershipForm.vue';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import MembershipTypeField from '@src/components/pages/membership_form/MembershipTypeField.vue';
import { createStore } from '@src/store/membership_store';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Store } from 'vuex';
import { nextTick } from 'vue';
import { IBAN } from '@test/data/bankdata';
import { newSucceedingBankValidationResource } from '@test/unit/TestDoubles/SucceedingBankValidationResource';
import type { Salutation } from '@src/view_models/Salutation';
import { addressValidationPatterns, dateOfBirthValidationPattern } from '@test/data/validation';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { TrackingData } from '@src/view_models/TrackingData';
import { Validity } from '@src/view_models/Validity';
import axios from 'axios';
import { errorSummaryItemIsFunctional } from '@test/unit/utils/errorSummaryItemIsFunctional';
import { createFeatureToggle } from '@src/util/createFeatureToggle';

// This is so the error summary scrollIntoView doesn't throw errors
const errorSummaryScrollElement = { scrollIntoView: () => {} };
Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => errorSummaryScrollElement } );

jest.mock( 'axios' );
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

describe( 'MembershipForm.vue', () => {
	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>; store: Store<any> } => {
		const wrapper = mount( MembershipForm, {
			props: {
				validateAddressUrl: '',
				validateEmailUrl: '',
				validateBankDataUrl: 'https://example.com/amount-check',
				validateLegacyBankDataUrl: 'https://example.com/amount-check',
				validateFeeUrl: 'https://example.com/amount-check',
				paymentAmounts: [ 500 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'UEB' ],
				countries: [ testCountry ],
				salutations,
				showMembershipTypeOption: true,
				addressValidationPatterns,
				dateOfBirthValidationPattern: dateOfBirthValidationPattern,
				campaignValues: {} as CampaignValues,
				trackingData: {} as TrackingData,
			},
			global: {
				plugins: [ store ],
				provide: {
					bankValidationResource: newSucceedingBankValidationResource(),
				},
			},
			components: {
				FeatureToggle: createFeatureToggle( [] ),
			},
		} );

		return { wrapper, store };
	};

	beforeEach( () => {
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.restoreAllMocks();
	} );

	it( 'sets address type in store when it receives address-type event', () => {
		const { wrapper, store } = getWrapper();

		store.dispatch = jest.fn( () => Promise.resolve() );
		const expectedAction = action( 'membership_address', 'setAddressType' );
		const expectedPayload = AddressTypeModel.PERSON;

		wrapper.findComponent( AddressType ).vm.$emit( 'field-changed', AddressTypeModel.PERSON );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'toggle membership type visibility', async () => {
		const { wrapper } = getWrapper();

		wrapper.findComponent( MembershipTypeField );
		expect( wrapper.findComponent( MembershipTypeField ).exists() ).toBe( true );

		await wrapper.setProps( { showMembershipTypeOption: false } );

		expect( wrapper.findComponent( MembershipTypeField ).exists() ).toBe( false );
	} );

	it( 'shows and hides the error summary', async () => {
		const { wrapper } = getWrapper();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#amount-500' ).trigger( 'change' );
		await wrapper.find( '#interval-0' ).trigger( 'change' );
		await wrapper.find( '#paymentType-0' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( '#salutation-0' ).trigger( 'change' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#post-code' ).setValue( 'post-code' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		await wrapper.find( '#country' ).setValue( 'country' );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'has a functional error summary', async () => {
		const store = createStore();

		await store.dispatch( action( 'membership_fee', 'initializeMembershipFee' ), {
			validateFeeUrl: '',
			fee: '',
			type: 'BEZ',
			interval: '',
		} );

		const { wrapper } = getWrapper( store );

		await wrapper.setProps( { paymentTypes: [ 'BEZ' ] } );

		await wrapper.find( '#country' ).setValue( 'I am clearly not a country' );
		await wrapper.find( '#country' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'interval-0', 'payment-form-interval' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'amount-500', 'payment-form-amount' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'iban', 'payment-form-iban' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'salutation-0', 'address-form-salutation' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'first-name', 'address-form-first-name' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'last-name', 'address-form-last-name' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'street', 'address-form-street' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'post-code', 'address-form-post-code' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'city', 'address-form-city' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'country', 'address-form-country' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'email', 'address-form-email' ) ).toBeTruthy();
	} );

	it( 'submits the form', async () => {
		mockedAxios.post.mockResolvedValue( { data: { status: 'OK' } } );
		const store = createStore();

		await store.dispatch( action( 'membership_fee', 'initializeMembershipFee' ), {
			validateFeeUrl: '',
			fee: '500',
			type: 'BEZ',
			interval: '12',
		} );
		await store.dispatch( action( 'bankdata', 'initializeBankData' ), {
			bankName: 'ING-DiBa',
			iban: IBAN,
			bic: 'INGDDEFFXXX',
		} );
		await store.dispatch( action( 'membership_address', 'initializeAddress' ), {
			addressType: AddressTypeModel.PERSON,
			receipt: true,
			fields: [
				{ name: 'salutation', value: 'Herr', validity: Validity.RESTORED },
				{ name: 'title', value: 'Dr', validity: Validity.RESTORED },
				{ name: 'firstName', value: 'value', validity: Validity.RESTORED },
				{ name: 'lastName', value: 'value', validity: Validity.RESTORED },
				{ name: 'street', value: 'value', validity: Validity.RESTORED },
				{ name: 'postcode', value: '12345', validity: Validity.RESTORED },
				{ name: 'city', value: 'value', validity: Validity.RESTORED },
				{ name: 'country', value: 'value', validity: Validity.RESTORED },
				{ name: 'email', value: 'value@gmail.com', validity: Validity.RESTORED },
				{ name: 'companyName', value: 'value', validity: Validity.RESTORED },
			],
			incentives: [ 'tote_bag' ],
		} );

		const { wrapper } = getWrapper( store );

		const submitForm = wrapper.find<HTMLFormElement>( '#submit-form' );
		submitForm.element.submit = jest.fn();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await flushPromises();

		expect( submitForm.element.submit ).toHaveBeenCalled();
	} );

} );
