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
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { useReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { InitialAddressValues } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import countries from '@test/data/countries';
import { nextTick } from 'vue';

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

const initialValues: InitialAddressValues = {
	addressType: AddressTypeModel.PERSON,
	fields: [
		{ name: 'salutation', value: 'Herr', validity: Validity.RESTORED },
		{ name: 'title', value: 'Prof. Dr.', validity: Validity.RESTORED },
		{ name: 'companyName', value: 'ACME', validity: Validity.RESTORED },
		{ name: 'firstName', value: 'Wiley', validity: Validity.RESTORED },
		{ name: 'lastName', value: 'Coyote', validity: Validity.RESTORED },
		{ name: 'country', value: 'IE', validity: Validity.RESTORED },
		{ name: 'city', value: 'The Desert', validity: Validity.RESTORED },
		{ name: 'postcode', value: '666', validity: Validity.RESTORED },
		{ name: 'street', value: 'Desert Street', validity: Validity.RESTORED },
		{ name: 'email', value: 'wiley.coyote@wikimedia.de', validity: Validity.RESTORED },
	],
	newsletter: false,
	receipt: true,
};

describe( 'PersonalDataSectionDonationReceipt.vue', () => {
	const getWrapper = ( store: Store<any> = createStore() ): VueWrapper<any> => {
		return mount( PersonalDataSectionDonationReceipt, {
			props: {
				countries: countries,
				salutations,
				trackingData: {} as TrackingData,
				campaignValues: {} as CampaignValues,
				addressValidationPatterns: { postcode: '', salutation: '' } as AddressValidation,
				isDirectDebitPayment: false,
				disabledAddressTypes: [],
				addressType: AddressTypeModel.UNSET,
				receiptModel: useReceiptModel( store ),
				addressTypeIsInvalid: false,
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
	};

	it( 'initialises the address form data when mounted', async () => {
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), initialValues );
		store.dispatch = jest.fn().mockResolvedValue( true );

		const wrapper = getWrapper( store );

		await nextTick();

		expect( wrapper.find<HTMLInputElement>( '#salutation-0' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( '#title' ).element.value ).toStrictEqual( 'Prof. Dr.' );
		expect( wrapper.find<HTMLInputElement>( '#first-name' ).element.value ).toStrictEqual( 'Wiley' );
		expect( wrapper.find<HTMLInputElement>( '#last-name' ).element.value ).toStrictEqual( 'Coyote' );
		expect( wrapper.find<HTMLInputElement>( '#email' ).element.value ).toStrictEqual( 'wiley.coyote@wikimedia.de' );
		expect( wrapper.find<HTMLInputElement>( '#addressType-0' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( '#country' ).element.value ).toStrictEqual( 'Ireland' );
		expect( wrapper.find<HTMLInputElement>( '#city' ).element.value ).toStrictEqual( 'The Desert' );
		expect( wrapper.find<HTMLInputElement>( '#post-code' ).element.value ).toStrictEqual( '666' );
		expect( wrapper.find<HTMLInputElement>( '#street' ).element.value ).toStrictEqual( 'Desert Street' );
	} );

	it( 'shows the address fields when the donor wants a receipt', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.address-section' ).exists() ).toBeFalsy();

		await wrapper.find( '#donationReceipt-0' ).trigger( 'change' );

		expect( wrapper.find( '.address-section' ).exists() ).toBeTruthy();
	} );

	it( 'disables NO option on question for full address and shows info icon', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { isDirectDebitPayment: true } );
		await nextTick();

		expect( wrapper.find( '.radio-field-tooltip' ).isVisible() ).toBe( true );
	} );

	it( 'NO option is not disabled when direct debit is not selected', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { isDirectDebitPayment: false } );
		await nextTick();

		expect( wrapper.find( '.radio-field-tooltip' ).exists() ).toBe( false );
	} );
} );
