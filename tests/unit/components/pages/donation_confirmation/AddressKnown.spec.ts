import { mount, VueWrapper } from '@vue/test-utils';
import { companyPayPalConfirmationData, payPalConfirmationData } from '../../../../data/confirmationData';
import AddressKnown from '@src/components/pages/donation_confirmation/AddressKnown.vue';

describe( 'AddressKnown.vue', () => {
	const getWrapper = (): VueWrapper<any> => {
		return mount( AddressKnown, {
			props: {
				donation: payPalConfirmationData.donation,
				address: payPalConfirmationData.address,
				addressType: payPalConfirmationData.addressType,
				countries: payPalConfirmationData.countries,
				salutations: payPalConfirmationData.salutations,
			},
		} );
	};

	it( 'renders messages', () => {
		const wrapper = getWrapper();

		expect( wrapper.text() ).toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_email' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_address_update' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_address_update_link' );
	} );

	it( 'renders person address for person address type', () => {
		const wrapper = getWrapper();

		expect( wrapper.text() ).toContain( 'donation_confirmation_address_person' );
	} );

	it( 'emits event when update address link is clicked', () => {
		const wrapper = getWrapper();

		wrapper.find( '#update-address-link' ).trigger( 'click' );

		expect( wrapper.emitted( 'show-address-modal' ) ).toBeTruthy();
	} );

	it( 'renders company address for firma address type', () => {
		const wrapper = mount( AddressKnown, {
			props: {
				donation: companyPayPalConfirmationData.donation,
				address: companyPayPalConfirmationData.address,
				addressType: companyPayPalConfirmationData.addressType,
				countries: companyPayPalConfirmationData.countries,
				salutations: payPalConfirmationData.salutations,
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_address_company' );
	} );
} );
