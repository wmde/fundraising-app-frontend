import { mount, VueWrapper } from '@vue/test-utils';
import Sidebar from '@src/components/pages/membership_fee_change/Sidebar.vue';

describe( 'Sidebar.vue', () => {
	const getWrapper = ( externalMemberId: number ): VueWrapper<any> => {
		return mount( Sidebar, {
			props: {
				externalMemberId,
				assetsPath: '/',
			},
		} );
	};

	test( 'shows bank info card if there is no external member id', () => {
		const wrapper = getWrapper( null );

		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_sidebar_headline' );
		expect( wrapper.text() ).toContain( 'bank_data_title_new_prefix' );
	} );

	test( 'shows external ID card if there is an external member id', () => {
		const wrapper = getWrapper( 123456 );

		expect( wrapper.text() ).toContain( 'membership_fee_upgrade_sidebar_headline' );
		expect( wrapper.text() ).not.toContain( 'bank_data_title_new_prefix' );
	} );
} );
