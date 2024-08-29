import { flushPromises, mount, VueWrapper } from '@vue/test-utils';

import axios from 'axios';
import { createStore, StoreKey } from '@src/store/donation_store';
import { action } from '@src/store/util';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import { Store } from 'vuex';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressValidation } from '@src/view_models/Validation';
import { nextTick } from 'vue';
import { Validity } from '@src/view_models/Validity';
import { Salutation } from '@src/view_models/Salutation';
import PersonalDataSectionDonationReceipt from '@src/components/pages/donation_form/singlePageFromSections/PersonalDataSectionDonationReceipt.vue';

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

jest.mock( 'axios' );
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe( 'PersonalDataSectionDonationReceipt.vue', () => {
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
					[ StoreKey as symbol ]: store,
				},
				components: {
					FeatureToggle: createFeatureToggle( [ 'campaigns.address_type_steps.preselect' ] ),
				},
			},
		} );

		return { wrapper, store };
	};

	const setPaymentType = ( store: Store<any>, paymentType: string ): Promise<any> => {
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

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeFalsy();

		await setPaymentType( store, 'BEZ' );

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeTruthy();
	} );

	it( 'hides bank data fields if payment type is not direct debit', async () => {
		const { wrapper, store } = getWrapper();

		await setPaymentType( store, 'BEZ' );

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeTruthy();

		await setPaymentType( store, 'UEB' );

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeFalsy();
	} );

	it( 'scrolls to payment section when button for changing payment data is clicked', async () => {
		const focusElement = { focus: jest.fn() };
		const scrollElement = { scrollIntoView: jest.fn() };
		const { wrapper } = getWrapper();

		await wrapper.find( '#previous-btn' ).trigger( 'click' );

		//TODO test that payment section got scrolled to
		expect( focusElement.focus ).toHaveBeenCalledWith( { preventScroll: true } );
		expect( scrollElement.scrollIntoView ).toHaveBeenCalledWith( { behavior: 'smooth' } );
	} );

	it( 'shows and hides the error summary', async () => {
		const { wrapper } = getWrapper();

		await wrapper.find( '#donation-form' ).trigger( 'submit' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#donationReceipt-0' ).trigger( 'change' );
		await wrapper.find( '#addressType-0' ).trigger( 'change' );
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

		await wrapper.find( '#country' ).setValue( 'country' );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'submits the form', async () => {
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), {
			addressType: AddressTypeModel.PERSON,
			newsletter: true,
			receipt: true,
			fields: [
				{ name: 'salutation', value: 'Mr', validity: Validity.RESTORED },
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
		} );

		mockedAxios.post.mockResolvedValue( { data: { status: 'OK' } } );
		const { wrapper } = getWrapper( store );

		const submitForm = wrapper.find<HTMLFormElement>( '#donation-form-submit-values' );
		submitForm.element.submit = jest.fn();

		await wrapper.find( '#donation-form' ).trigger( 'submit' );
		await flushPromises();

		expect( submitForm.element.submit ).toHaveBeenCalled();
	} );
} );
