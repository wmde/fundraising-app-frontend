import { mount } from '@vue/test-utils';
import DonationCommentPopUp from '@src/components/pages/donation_confirmation/DonationCommentPopUp.vue';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';

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
		} );

		expect( wrapper.find( '#withName' ).exists() ).toBeTruthy();
	} );

	it( 'hides anyonmous comment toggle for anonymous donations', () => {
		const wrapper = mount( DonationCommentPopUp, {
			props: getDefaultConfirmationData( true ),
		} );

		expect( wrapper.find( '#withName' ).exists() ).toBeFalsy();
	} );
} );
