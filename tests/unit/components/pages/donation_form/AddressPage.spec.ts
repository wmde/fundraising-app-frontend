import { mount, VueWrapper } from '@vue/test-utils';

import AddressPage from '@src/components/pages/donation_form/subpages/AddressPage.vue';
import { createStore, StoreKey } from '@src/store/donation_store';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_PAYMENT } from '@src/store/namespaces';
import { initializePayment } from '@src/store/payment/actionTypes';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import { initializeAddress, setAddressType } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import AddressType from '@src/components/pages/donation_form/AddressTypeAllOptions.vue';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import { Store } from 'vuex';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressValidation } from '@src/view_models/Validation';
import { nextTick } from 'vue';
import AddressTypeAllOptions from '@src/components/pages/donation_form/AddressTypeAllOptions.vue';
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
		return store.dispatch( action( NS_PAYMENT, initializePayment ), {
			amount: '100',
			type: paymentType,
			paymentIntervalInMonths: '0',
			isCustomAmount: false,
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
		const expectedAction = action( NS_ADDRESS, setAddressType );
		const expectedPayload = AddressTypeModel.ANON;

		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.ANON );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'emits previous event', async () => {
		const { wrapper } = getWrapper();

		await wrapper.find( '#previous-btn' ).trigger( 'click' );

		expect( wrapper.emitted( 'previous-page' ).length ).toStrictEqual( 1 );
	} );

	it( 'scrolls to first error on submit bad data', async () => {
		const scrollIntoView = jest.fn();
		jest.spyOn( document, 'getElementsByClassName' ).mockImplementation( () => {
			return [ { scrollIntoView } ] as unknown as HTMLCollectionOf<HTMLElement>;
		} );

		const { wrapper } = getWrapper();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();

		expect( scrollIntoView ).toHaveBeenCalled();
	} );

	it( 'updates full selected', async () => {
		const { wrapper } = getWrapper();

		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.PERSON );
		wrapper.findComponent( AddressTypeAllOptions ).vm.$emit( 'set-full-selected' );
		await nextTick();

		expect( wrapper.find( '.address-type-person' ).exists() ).toBeTruthy();
	} );

	// TODO: Figure out how to test that the form submits
	it.skip( 'submits the form', async () => {
		const store = createStore();
		await store.dispatch( action( NS_ADDRESS, initializeAddress ), {
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

		const submit = jest.fn();
		jest.spyOn( document, 'getElementById' ).mockImplementation( () => {
			return { submit } as unknown as HTMLElement;
		} );
		const { wrapper } = getWrapper( store );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		expect( submit ).toHaveBeenCalled();
	} );

} );
