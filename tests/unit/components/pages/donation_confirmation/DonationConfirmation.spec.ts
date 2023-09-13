import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import DonationConfirmation from '@/components/pages/DonationConfirmation.vue';
import { createStore } from '@/store/donation_store';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import {
	anonymousBankTransferConfirmationData,
	anonymousExportedPayPalConfirmationData,
	bankTransferConfirmationData,
	companyExportedPayPalConfirmationData,
	donationExportedConfirmationData,
	emailBankTransferConfirmationData,
	emailExportedPayPalConfirmationData,
	payPalConfirmationData,
} from '../../../../data/confirmationData';
import { addressValidationPatterns } from '../../../../data/validation';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( FeatureTogglePlugin );

describe( 'DonationConfirmation', () => {

	const getWrapper = ( bankData: Object ) => {
		return mount( DonationConfirmation, {
			localVue,
			propsData: {
				validateEmailUrl: '',
				validateAddressUrl: '',
				hasErrored: false,
				hasSucceeded: false,
				addressValidationPatterns,
				donorResource: {},
				...bankData,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );
	};

	it( 'displays bank data success message for bank transfer payments', () => {
		const wrapper = getWrapper( bankTransferConfirmationData );

		expect( wrapper.find( '.success-message-bank-transfer' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.success-message' ).exists() ).toBeFalsy();
	} );

	it( 'displays standard success message for non-bank transfer payments', () => {
		const wrapper = getWrapper( payPalConfirmationData );

		expect( wrapper.find( '.success-message-bank-transfer' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.success-message' ).exists() ).toBeTruthy();
	} );

	it( 'displays anonymous address card for anonymous address type', () => {
		const wrapper = getWrapper( anonymousBankTransferConfirmationData );

		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
	} );

	it( 'displays anonymous address card for email address type', () => {
		const wrapper = getWrapper( emailBankTransferConfirmationData );

		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
	} );

	it( 'displays known address card for known address types', () => {
		const wrapper = getWrapper( payPalConfirmationData );

		expect( wrapper.find( '.known-address' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeFalsy();
	} );

	it( 'displays donation exported card when donation is exported and person', () => {
		const wrapper = getWrapper( donationExportedConfirmationData );

		expect( wrapper.find( '.exported-donation' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeFalsy();
	} );

	it( 'displays donation exported card when donation is exported and company', () => {
		const wrapper = getWrapper( companyExportedPayPalConfirmationData );

		expect( wrapper.find( '.exported-donation' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeFalsy();
	} );

	it( 'does not display donation exported card when donation is anonymous', () => {
		const wrapper = getWrapper( anonymousExportedPayPalConfirmationData );

		expect( wrapper.find( '.exported-donation' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeFalsy();
	} );

	it( 'does not display donation exported card when donation is email', () => {
		const wrapper = getWrapper( emailExportedPayPalConfirmationData );

		expect( wrapper.find( '.exported-donation' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeFalsy();
	} );

} );
