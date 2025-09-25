import { mount, VueWrapper } from '@vue/test-utils';
import Sidebar from '@src/components/pages/membership_fee_change/Sidebar.vue';

describe( 'Sidebar.vue', () => {
	const getWrapper = ( externalMemberId: number ): VueWrapper<any> => {
		return mount( Sidebar, {
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
