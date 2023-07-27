import { shallowMount } from '@vue/test-utils';
import Header from '@/components/layout/Header.vue';

describe( 'Header.vue', () => {
	it.each( [
		[ 'donation-form', 1 ],
		[ 'donation-confirmation', 1 ],
		[ 'membership-application', 2 ],
		[ 'membership-application-confirmation', 2 ],
		[ 'faq-page', 3 ],
		[ 'use-of-funds', 4 ],
	] )( 'highlights the correct navigation items', ( pageIdentifier: string, navItemIndex: number ) => {
		const wrapper = shallowMount( Header, {
			propsData: {
				assetsPath: '',
				pageIdentifier,
			},
			mocks: {
				$t: ( key: string ) => key,
			},
		} );

		expect( wrapper.find( '#navMenu .navbar-item:nth-child(' + navItemIndex + ')' ).classes() ).toContain( 'active' );
	} );
} );
