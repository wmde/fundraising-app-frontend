import { mount, VueWrapper } from '@vue/test-utils';
import DonationConfirmation from '@src/components/pages/DonationConfirmation.vue';
import { createStore } from '@src/store/donation_store';
import {
	anonymousBankTransferConfirmationData,
	anonymousExportedPayPalConfirmationData,
	bankTransferConfirmationData,
	companyExportedPayPalConfirmationData,
	donationExportedConfirmationData,
	emailBankTransferConfirmationData,
	emailExportedPayPalConfirmationData,
	payPalConfirmationData,
} from '@test/data/confirmationData';
import type { ConfirmationData } from '@test/data/confirmationData';
import { addressValidationPatterns } from '@test/data/validation';
import type { DonorResource } from '@src/api/DonorResource';
import { FakeSucceedingCommentResource } from '@test/unit/TestDoubles/FakeCommentResource';

describe( 'DonationConfirmation.vue', () => {
	const getWrapper = ( bankData: ConfirmationData, translateMock: ( key: string ) => string = ( key: string ) => key ): VueWrapper<any> => {
		return mount( DonationConfirmation, {
			props: {
				validateEmailUrl: '',
				validateAddressUrl: '',
				postCommentUrl: '',
				tracking: '',
				hasErrored: false,
				hasSucceeded: false,
				addressValidationPatterns,
				donorResource: {} as DonorResource,
				addressType: bankData.addressType,
				address: bankData.address,
				donation: bankData.donation,
				countries: bankData.countries,
				salutations: bankData.salutations,
			},
			global: {
				plugins: [ createStore() ],
				mocks: {
					$t: translateMock,
					$n: () => {},
				},
				provide: {
					commentResource: new FakeSucceedingCommentResource(),
				},
			},
		} );
	};

	it( 'displays bank data success message for bank transfer payments', () => {
		const wrapper = getWrapper( bankTransferConfirmationData );

		expect( wrapper.find( 'h1' ).text() ).toStrictEqual( 'donation_confirmation_topbox_payment_title_bank_transfer_alt' );
	} );

	it( 'displays standard success message for non-bank transfer payments', () => {
		const wrapper = getWrapper( payPalConfirmationData );

		expect( wrapper.find( 'h1' ).text() ).toStrictEqual( 'donation_confirmation_topbox_payment_title_alt' );
	} );

	it( 'displays anonymous address card for anonymous address type', () => {
		const wrapper = getWrapper( anonymousBankTransferConfirmationData );

		expect( wrapper.text() ).toContain( 'donation_confirmation_cta_title_alt' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title_no_receipt_wanted' );
	} );

	it( 'displays anonymous address card for email address type', () => {
		const wrapper = getWrapper( emailBankTransferConfirmationData );

		expect( wrapper.text() ).toContain( 'donation_confirmation_cta_title_alt' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title_no_receipt_wanted' );
	} );

	it( 'displays known address card for known address types', () => {
		const wrapper = getWrapper( payPalConfirmationData );

		expect( wrapper.text() ).toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_cta_title_alt' );
	} );

	it( 'displays donation exported card when donation is exported and person', () => {
		const wrapper = getWrapper( donationExportedConfirmationData );

		expect( wrapper.text() ).toContain( 'donation_confirmation_exported_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_cta_title_alt' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title_no_receipt_wanted' );
	} );

	it( 'displays donation exported card when donation is exported and company', () => {
		const wrapper = getWrapper( companyExportedPayPalConfirmationData );

		expect( wrapper.text() ).toContain( 'donation_confirmation_exported_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_cta_title_alt' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title_no_receipt_wanted' );
	} );

	it( 'does not display donation exported card when donation is anonymous', () => {
		const wrapper = getWrapper( anonymousExportedPayPalConfirmationData );

		expect( wrapper.text() ).not.toContain( 'donation_confirmation_exported_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_cta_title_alt' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title_no_receipt_wanted' );
	} );

	it( 'does not display donation exported card when donation is email', () => {
		const wrapper = getWrapper( emailExportedPayPalConfirmationData );

		expect( wrapper.text() ).not.toContain( 'donation_confirmation_exported_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_cta_title_alt' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title' );
		expect( wrapper.text() ).not.toContain( 'donation_confirmation_summary_title_no_receipt_wanted' );
	} );

	it( 'shows the survey tile if survey link language item is not blank', () => {
		const translateMock = ( key: string ): string => key;
		const wrapper = getWrapper( bankTransferConfirmationData, translateMock );

		expect( wrapper.text() ).toContain( 'donation_confirmation_survey_title' );
	} );

	it( 'hides the survey tile if survey link language item is blank', () => {
		const translateMock = ( key: string ): string => {
			if ( key === 'donation_confirmation_survey_link' ) {
				return '';
			}

			return key;
		};
		const wrapper = getWrapper( bankTransferConfirmationData, translateMock );

		expect( wrapper.text() ).not.toContain( 'donation_confirmation_survey_title' );
	} );

} );
