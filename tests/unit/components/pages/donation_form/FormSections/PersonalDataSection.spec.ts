import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import PersonalDataSection from '@src/components/pages/donation_form/FormSections/PersonalDataSection.vue';
import { Store } from 'vuex';

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
	let store: Store<any>;

	const getWrapper = (): VueWrapper<any> => {
		store = createStore();

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
				plugins: [ store ],
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

		expect( wrapper.find( '#laika-donation-personal-data-person' ).classes() ).toContain( 'display-toggler--visible' );
		expect( wrapper.find( '#laika-donation-personal-data-company' ).classes() ).not.toContain( 'display-toggler--visible' );
		expect( wrapper.find( '#laika-donation-personal-data-email' ).classes() ).not.toContain( 'display-toggler--visible' );

		await wrapper.setProps( { addressType: AddressTypeModel.COMPANY } );

		expect( wrapper.find( '#laika-donation-personal-data-person' ).classes() ).not.toContain( 'display-toggler--visible' );
		expect( wrapper.find( '#laika-donation-personal-data-company' ).classes() ).toContain( 'display-toggler--visible' );
		expect( wrapper.find( '#laika-donation-personal-data-email' ).classes() ).not.toContain( 'display-toggler--visible' );

		await wrapper.setProps( { addressType: AddressTypeModel.EMAIL } );

		expect( wrapper.find( '#laika-donation-personal-data-person' ).classes() ).not.toContain( 'display-toggler--visible' );
		expect( wrapper.find( '#laika-donation-personal-data-company' ).classes() ).not.toContain( 'display-toggler--visible' );
		expect( wrapper.find( '#laika-donation-personal-data-email' ).classes() ).toContain( 'display-toggler--visible' );

		await wrapper.setProps( { addressType: AddressTypeModel.ANON } );

		expect( wrapper.find( '#laika-donation-personal-data-person' ).classes() ).not.toContain( 'display-toggler--visible' );
		expect( wrapper.find( '#laika-donation-personal-data-company' ).classes() ).not.toContain( 'display-toggler--visible' );
		expect( wrapper.find( '#laika-donation-personal-data-email' ).classes() ).not.toContain( 'display-toggler--visible' );
	} );
} );
