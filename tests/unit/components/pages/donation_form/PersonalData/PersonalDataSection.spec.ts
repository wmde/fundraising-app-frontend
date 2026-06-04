import { describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/donation_store';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import PersonalDataSection from '@src/components/pages/donation_form/PersonalData/PersonalDataSection.vue';
import { useReceiptModel } from '@src/components/pages/donation_form/composables/useReceiptModel';

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
		const store = createStore();

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
				receiptModel: useReceiptModel( store ),
			},
			global: {
				plugins: [ store ],
			},
			attachTo: document.body,
		} );
	};

	it( 'Toggles the address fields', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '#address-form-is-company' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#address-form-country' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#address-form-post-code' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#address-form-city' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#address-form-street' ).exists() ).toBeTruthy();

		await wrapper.find( '#donation-receipt' ).trigger( 'click' );

		expect( wrapper.find( '#address-form-is-company' ).exists() ).toBeFalsy();
		expect( wrapper.find( '#address-form-country' ).exists() ).toBeFalsy();
		expect( wrapper.find( '#address-form-post-code' ).exists() ).toBeFalsy();
		expect( wrapper.find( '#address-form-city' ).exists() ).toBeFalsy();
		expect( wrapper.find( '#address-form-street' ).exists() ).toBeFalsy();
	} );
} );
