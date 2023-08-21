import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import MembershipInfo from '@/components/pages/donation_confirmation/MembershipInfo.vue';
import { createStore } from '@/store/donation_store';

const localVue = createLocalVue();
localVue.use( Vuex );

const testAccessToken = 'a839bc8045aba4c8b600bc0477dbbf10';
const testId = 123;

describe( 'MembershipInfo', () => {
	it( 'renders messages', () => {
		const wrapper = mount( MembershipInfo, {
			localVue,
			propsData: {
				donation: {
					id: testId,
					accessToken: testAccessToken,
				},
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
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
			localVue,
			propsData: {
				donation: {
					id: testId,
					accessToken: testAccessToken,
				},
			},
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
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
