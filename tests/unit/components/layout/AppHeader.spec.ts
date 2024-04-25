import { shallowMount } from '@vue/test-utils';
import AppHeader from '@src/components/layout/AppHeader.vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

describe( 'AppHeader.vue', () => {
	it.each( [
		[ 'donation-form', 1 ],
		[ 'donation-confirmation', 1 ],
		[ 'membership-application', 2 ],
		[ 'membership-application-confirmation', 2 ],
		[ 'use-of-funds', 3 ],
		[ 'faq-page', 4 ],
	] )( 'highlights the correct navigation items', ( pageIdentifier: string, navItemIndex: number ) => {
		const wrapper = shallowMount( AppHeader, {
			props: {
				assetsPath: '',
				pageIdentifier,
			},
			global: {
				provide: {
					[ QUERY_STRING_INJECTION_KEY ]: '',
				},
			},
		} );

		const link = wrapper.find( '.navigation-items li:nth-child(' + navItemIndex + ') .navigation-item' );
		expect( link.classes() ).toContain( 'active' );
		expect( link.attributes( 'aria-current' ) ).toStrictEqual( 'page' );
	} );
} );
