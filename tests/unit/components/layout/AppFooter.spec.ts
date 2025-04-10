import { shallowMount } from '@vue/test-utils';
import AppFooter from '@src/components/layout/AppFooter.vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

describe( 'AppFooter.vue', () => {
	it.each( [
		[ 'contact', 1 ],
		[ 'imprint', 2 ],
		[ 'data_protection', 3 ],
		[ 'accessibility_statement', 4 ],
		[ 'supporters_list', 5 ],
		[ 'donor_comments', 6 ],
	] )( 'highlights the correct navigation items', ( pageIdentifier: string, navItemIndex: number ) => {
		const wrapper = shallowMount( AppFooter, {
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

		const link = wrapper.find( '.footer-list li:nth-child(' + navItemIndex + ') a' );
		expect( link.attributes( 'aria-current' ) ).toStrictEqual( 'page' );
	} );
} );
