import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import DonationConfirmation from '@/components/pages/DonationConfirmation.vue';
import { createStore } from '@/store/donation_store';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import {
	anonymousBankTransferConfirmationData,
	bankTransferConfirmationData, donationExportedConfirmationData,
	emailBankTransferConfirmationData,
	payPalConfirmationData,
} from '../../../../data/confirmationData';

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );
localVue.use( FeatureTogglePlugin );

describe( 'DonationConfirmation', () => {
	it( 'displays bank data success message for bank transfer payments', () => {
		const wrapper = mount( DonationConfirmation, {
			localVue,
			propsData: bankTransferConfirmationData,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '.success-message-bank-transfer' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.success-message' ).exists() ).toBeFalsy();
	} );

	it( 'displays standard success message for non-bank transfer payments', () => {
		const wrapper = mount( DonationConfirmation, {
			localVue,
			propsData: payPalConfirmationData,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '.success-message-bank-transfer' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.success-message' ).exists() ).toBeTruthy();
	} );

	it( 'displays anonymous address card for anonymous address type', () => {
		const wrapper = mount( DonationConfirmation, {
			localVue,
			propsData: anonymousBankTransferConfirmationData,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
	} );

	it( 'displays anonymous address card for email address type', () => {
		const wrapper = mount( DonationConfirmation, {
			localVue,
			propsData: emailBankTransferConfirmationData,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
	} );

	it( 'displays known address card for known address types', () => {
		const wrapper = mount( DonationConfirmation, {
			localVue,
			propsData: payPalConfirmationData,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '.known-address' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeFalsy();
	} );

	it( 'displays donation exported card when donation is exported', () => {
		const wrapper = mount( DonationConfirmation, {
			localVue,
			propsData: donationExportedConfirmationData,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.find( '.exported-donation' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.known-address' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.anonymous-address' ).exists() ).toBeFalsy();
	} );

} );
