import { mount, VueWrapper } from '@vue/test-utils';
import SideBar from '@src/components/pages/membership_fee_change/SideBar.vue';

describe( 'SideBar.vue', () => {
	const getWrapper = ( externalMemberId: number ): VueWrapper<any> => {
		return mount( SideBar, {
			props: {
				externalMemberId,
			},
		} );
	};

	test( 'externalMemberIDCardIsNotVisibleIfExternalMemberIDIsNotProvided', () => {
		const wrapper = getWrapper( null );

		expect( wrapper.find( '#membership-id-sidebar-card' ).exists() ).toBeFalsy();
		expect( wrapper.find( '#bank-info-sidebar-card' ).exists() ).toBeTruthy();
	} );

	test( 'externalMemberIDCardIsVisibleIfExternalMemberIDIsProvided', () => {
		const wrapper = getWrapper( 123456 );

		expect( wrapper.find( '#membership-id-sidebar-card' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#bank-info-sidebar-card' ).exists() ).toBeFalsy();
	} );
} );
