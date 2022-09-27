import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import DonationConfirmation from '@/components/pages/DonationConfirmation.vue';
import { createStore } from '@/store/donation_store';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import { bankTransferConfirmationData, payPalConfirmationData } from '../../../../data/confirmationData';

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

} );
