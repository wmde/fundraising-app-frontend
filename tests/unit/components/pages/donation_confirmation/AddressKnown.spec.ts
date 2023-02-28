import { createLocalVue, mount } from '@vue/test-utils';
import { companyPayPalConfirmationData, payPalConfirmationData } from '../../../../data/confirmationData';
import { createStore } from '@/store/donation_store';
import AddressKnown from '@/components/pages/donation_confirmation/AddressKnown.vue';

const localVue = createLocalVue();

describe( 'AddressKnown', () => {
	it( 'renders messages', () => {
		const wrapper = mount( AddressKnown, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				address: payPalConfirmationData.address,
				addressType: payPalConfirmationData.addressType,
				countries: payPalConfirmationData.countries,
				salutations: payPalConfirmationData.salutations,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_email' );
		// TODO: Activate these when https://phabricator.wikimedia.org/T316632 is done
		// expect( wrapper.text() ).toContain( 'donation_confirmation_address_update' );
		// expect( wrapper.text() ).toContain( 'donation_confirmation_address_update_link' );
	} );

	it( 'renders person address for person address type', () => {
		const wrapper = mount( AddressKnown, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				address: payPalConfirmationData.address,
				addressType: payPalConfirmationData.addressType,
				countries: payPalConfirmationData.countries,
				salutations: payPalConfirmationData.salutations,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_address_person' );
	} );

	it( 'renders company address for firma address type', () => {
		const wrapper = mount( AddressKnown, {
			localVue,
			propsData: {
				donation: companyPayPalConfirmationData.donation,
				address: companyPayPalConfirmationData.address,
				addressType: companyPayPalConfirmationData.addressType,
				countries: companyPayPalConfirmationData.countries,
				salutations: payPalConfirmationData.salutations,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_address_company' );
	} );

	test.skip( 'emits event when update address link is clicked', () => {
		const wrapper = mount( AddressKnown, {
			localVue,
			propsData: {
				donation: payPalConfirmationData.donation,
				address: payPalConfirmationData.address,
				addressType: payPalConfirmationData.addressType,
				countries: payPalConfirmationData.countries,
				salutations: payPalConfirmationData.salutations,
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
				$n: () => {},
			},
		} );

		wrapper.find( '#update-address-link' ).trigger( 'click' );

		expect( wrapper.emitted( 'show-address-modal' ) ).toBeTruthy();
	} );
} );
