import { mount } from '@vue/test-utils';
import MembershipInfo from '@src/components/pages/donation_confirmation/MembershipInfo.vue';

const testAccessToken = 'a839bc8045aba4c8b600bc0477dbbf10';
const testId = 123;

describe( 'MembershipInfo.vue', () => {
	it( 'renders messages', () => {
		const wrapper = mount( MembershipInfo, {
			props: {
				donation: {
					id: testId,
					accessToken: testAccessToken,
				},
			},
		} );

		expect( wrapper.text() ).toContain( 'donation_confirmation_membership_call_to_action_title' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_membership_call_to_action_text' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_membership_button' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_bottombox_membership_benefit_1' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_bottombox_membership_benefit_2' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_bottombox_membership_benefit_3' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_bottombox_membership_benefit_4' );
		expect( wrapper.text() ).toContain( 'donation_confirmation_bottombox_membership_link' );
	} );

	it( 'renders access token and donation ID in membership application URL', () => {
		const wrapper = mount( MembershipInfo, {
			props: {
				donation: {
					id: testId,
					accessToken: testAccessToken,
				},
			},
		} );

		let href = wrapper.find( '#membership-application-url' ).element.attributes.getNamedItem( 'href' );
		expect( href!.value ).toMatch(
			'apply-for-membership?donationId=' + testId +
			'&donationAccessToken=' + testAccessToken +
			'&type=sustaining'
		);
	} );
} );
