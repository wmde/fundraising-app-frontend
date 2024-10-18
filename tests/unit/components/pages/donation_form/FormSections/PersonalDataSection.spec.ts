import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import PersonalDataSection from '@src/components/pages/donation_form/FormSections/PersonalDataSection.vue';

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
	const getWrapper = (): VueWrapper<any> => {
		return mount( PersonalDataSection, {
			props: {
				countries: [ testCountry ],
				salutations,
				trackingData: {} as TrackingData,
				campaignValues: {} as CampaignValues,
				addressValidationPatterns: { postcode: '', country: null } as AddressValidation,
				isDirectDebitPayment: false,
				disabledAddressTypes: [],
				addressType: AddressTypeModel.UNSET,
				addressTypeIsInvalid: false,
			},
			global: {
				plugins: [ createStore() ],
			},
		} );
	};

	it( 'emits when it receives address-type event', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#addressType-1' ).trigger( 'change' );
		await wrapper.find( '#addressType-2' ).trigger( 'change' );

		expect( wrapper.emitted( 'set-address-type' ).length ).toStrictEqual( 2 );
		expect( wrapper.emitted( 'set-address-type' )[ 0 ][ 0 ] ).toStrictEqual( AddressTypeModel.COMPANY );
		expect( wrapper.emitted( 'set-address-type' )[ 1 ][ 0 ] ).toStrictEqual( AddressTypeModel.ANON );
	} );

	it( 'Shows the correct form when address type is changed', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { addressType: AddressTypeModel.PERSON } );

		expect( wrapper.find( '.address-type-person' ).exists() ).toBeTruthy();

		await wrapper.setProps( { addressType: AddressTypeModel.COMPANY } );

		expect( wrapper.find( '.address-type-company' ).exists() ).toBeTruthy();

		await wrapper.setProps( { addressType: AddressTypeModel.ANON } );

		expect( wrapper.find( '.address-type-person' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.address-type-company' ).exists() ).toBeFalsy();
	} );
} );
