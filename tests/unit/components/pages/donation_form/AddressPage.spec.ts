import { flushPromises, mount, VueWrapper } from '@vue/test-utils';

import axios from 'axios';
import AddressPage from '@src/components/pages/donation_form/subpages/AddressPage.vue';
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
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import { Validity } from '@src/view_models/Validity';
import { Salutation } from '@src/view_models/Salutation';

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

describe( 'AddressPage.vue', () => {
	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( AddressPage, {
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

	it( 'sets address type in store when it receives address-type event', () => {
		const { wrapper, store } = getWrapper();

		store.dispatch = jest.fn();
		const expectedAction = action( 'address', 'setAddressType' );
		const expectedPayload = AddressTypeModel.ANON;

		wrapper.findComponent( AddressTypeBasic ).vm.$emit( 'address-type', AddressTypeModel.ANON );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'emits previous event', async () => {
		const { wrapper } = getWrapper();

		await wrapper.find( '#previous-btn' ).trigger( 'click' );

		expect( wrapper.emitted( 'previous-page' ).length ).toStrictEqual( 1 );
	} );

	it( 'shows and hides the error summary', async () => {
		const { wrapper } = getWrapper();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#addressType-0' ).trigger( 'change' );
		await wrapper.find( '#person-salutation-0' ).trigger( 'change' );

		await wrapper.find( '#person-first-name' ).setValue( 'first-name' );
		await wrapper.find( '#person-first-name' ).trigger( 'blur' );

		await wrapper.find( '#person-last-name' ).setValue( 'last-name' );
		await wrapper.find( '#person-last-name' ).trigger( 'blur' );

		await wrapper.find( '#person-street' ).setValue( 'street' );
		await wrapper.find( '#person-street' ).trigger( 'blur' );

		await wrapper.find( '#person-post-code' ).setValue( 'post-code' );
		await wrapper.find( '#person-post-code' ).trigger( 'blur' );

		await wrapper.find( '#person-city' ).setValue( 'city' );
		await wrapper.find( '#person-city' ).trigger( 'blur' );

		await wrapper.find( '#person-country' ).setValue( 'country' );
		await wrapper.find( '#person-country' ).trigger( 'blur' );

		await wrapper.find( '#person-email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#person-email' ).trigger( 'blur' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'updates full selected', async () => {
		const { wrapper } = getWrapper();

		wrapper.findComponent( AddressTypeBasic ).vm.$emit( 'address-type', AddressTypeModel.PERSON );
		wrapper.findComponent( AddressTypeBasic ).vm.$emit( 'set-full-selected' );
		await nextTick();

		expect( wrapper.find( '.address-type-person' ).exists() ).toBeTruthy();
	} );

	it( 'submits the form', async () => {
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), {
			addressType: AddressTypeModel.ANON,
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

		const submitForm = wrapper.find<HTMLFormElement>( '#submit-form' );
		submitForm.element.submit = jest.fn();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await flushPromises();

		expect( submitForm.element.submit ).toHaveBeenCalled();
	} );

} );
