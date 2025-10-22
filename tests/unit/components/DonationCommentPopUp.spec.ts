import { mount } from '@vue/test-utils';
import DonationCommentPopUp from '@src/components/pages/donation_confirmation/DonationCommentPopUp.vue';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { failureMessage, FakeFailingCommentResource, FakeSucceedingCommentResource, successMessage } from '@test/unit/TestDoubles/FakeCommentResource';

// This is so the error summary scrollIntoView doesn't throw errors
const errorSummaryScrollElement = { scrollIntoView: () => {} };
Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => errorSummaryScrollElement } );

describe( 'DonationCommentPopUp.vue', () => {
	function getDefaultConfirmationData( isAnonymous: boolean ): any {
		const sampleDonationData = {
			accessToken: 'a839bc8045aba4c8b600bc0477dbbf10',
			amount: 12.35,
			bankTransferCode: 'XW-XLK-M3F-Z',
			id: 1,
			interval: 0,
			receipt: true,
			newsletter: false,
			paymentType: 'UEB',
			updateToken: 'd387cebd6cc05efbd117545492cb0e99',
		};

		if ( !isAnonymous ) {
			return {
				donation: sampleDonationData,
				addressType: addressTypeName( AddressTypeModel.PERSON ),
				postCommentUrl: '',
			};
		}

		return {
			donation: sampleDonationData,
			addressType: addressTypeName( AddressTypeModel.ANON ),
			postCommentUrl: '',
		};
	}

	it( 'displays anyonmous comment toggle for private / company donations', () => {
		const wrapper = mount( DonationCommentPopUp, {
			props: getDefaultConfirmationData( false ),
			global: {
				provide: {
					commentResource: new FakeSucceedingCommentResource(),
				},
			},
		} );

		expect( wrapper.find( '#withName' ).exists() ).toBeTruthy();
	} );

	it( 'hides anyonmous comment toggle for anonymous donations', () => {
		const wrapper = mount( DonationCommentPopUp, {
			props: getDefaultConfirmationData( true ),
			global: {
				provide: {
					commentResource: new FakeSucceedingCommentResource(),
				},
			},
		} );

		expect( wrapper.find( '#withName' ).exists() ).toBeFalsy();
	} );

	it( 'shows error when comment is empty', async () => {
		const wrapper = mount( DonationCommentPopUp, {
			props: getDefaultConfirmationData( true ),
			global: {
				provide: {
					commentResource: new FakeSucceedingCommentResource(),
				},
			},
		} );

		await wrapper.trigger( 'submit' );

		expect( wrapper.find( '#comment-error' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#comment-error' ).text() ).toStrictEqual( 'donation_comment_popup_empty_error' );
	} );

	it( 'resets error when comment text is entered', async () => {
		const wrapper = mount( DonationCommentPopUp, {
			props: getDefaultConfirmationData( true ),
			global: {
				provide: {
					commentResource: new FakeSucceedingCommentResource(),
				},
			},
		} );

		await wrapper.trigger( 'submit' );

		expect( wrapper.find( '.field-container:has(#comment)' ).attributes( 'data-error' ) ).toBeTruthy();
		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#comment' ).setValue( 'My super great comment' );

		expect( wrapper.find( '.field-container:has(#comment)' ).attributes( 'data-error' ) ).toBeFalsy();
		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'shows error when API response is rejected', async () => {
		const wrapper = mount( DonationCommentPopUp, {
			props: getDefaultConfirmationData( true ),
			global: {
				provide: {
					commentResource: new FakeFailingCommentResource(),
				},
			},
		} );

		await wrapper.find( '#comment' ).setValue( 'My super great comment' );
		await wrapper.trigger( 'submit' );

		expect( wrapper.find( '#comment-error' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#comment-error' ).text() ).toStrictEqual( failureMessage );
	} );

	it( 'shows message returned from API', async () => {
		const wrapper = mount( DonationCommentPopUp, {
			props: getDefaultConfirmationData( true ),
			global: {
				provide: {
					commentResource: new FakeSucceedingCommentResource(),
				},
			},
		} );

		await wrapper.find( '#comment' ).setValue( 'My super great comment' );
		await wrapper.trigger( 'submit' );

		expect( wrapper.find( '.donation-comment-server-response' ).text() ).toStrictEqual( successMessage );
		expect( wrapper.find( '.donation-comment-return-button' ).exists() ).toBeTruthy();
	} );
} );
