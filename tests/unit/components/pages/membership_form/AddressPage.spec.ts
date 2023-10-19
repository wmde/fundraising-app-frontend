import { mount, VueWrapper } from '@vue/test-utils';

import AddressPage from '@src/components/pages/membership_form/subpages/AddressPage.vue';
import { createStore, StoreKeyMembership } from '@src/store/membership_store';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import { initializeAddress, setAddressType } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { Store } from 'vuex';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressValidation } from '@src/view_models/Validation';
import { nextTick } from 'vue';
import { Validity } from '@src/view_models/Validity';
import { Salutation } from '@src/view_models/Salutation';
import { dateOfBirthValidationPattern } from '@test/data/validation';
import { initializeMembershipFee, setType } from '@src/store/membership_fee/actionTypes';
import { InitialMembershipFeeValues } from '@src/view_models/MembershipFee';
import mockAxios from 'jest-mock-axios';

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
				dateOfBirthValidationPattern: dateOfBirthValidationPattern,
			},
			global: {
				plugins: [ store ],
				stubs: {
					Address: true,
				},
				provide: {
					[ StoreKeyMembership as symbol ]: store,
				},
			},
		} );

		return { wrapper, store };
	};

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

	// TODO: Figure out how to test that the form submits
	it.skip( 'submits the form', async () => {
		const store = createStore();
		await store.dispatch( action( NS_MEMBERSHIP_ADDRESS, initializeAddress ), {
			addressType: AddressTypeModel.PERSON,
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
