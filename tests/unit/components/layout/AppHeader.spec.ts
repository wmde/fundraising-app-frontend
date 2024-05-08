import { mount, VueWrapper } from '@vue/test-utils';
import AppHeader from '@src/components/layout/AppHeader.vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

describe( 'AppHeader.vue', () => {

	const getWrapper = ( pageIdentifier: string = '' ): VueWrapper<any> => {
		return mount( AppHeader, {
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
	};

	beforeEach( () => {
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it.each( [
		[ 'donation-form', 1 ],
		[ 'donation-confirmation', 1 ],
		[ 'membership-application', 2 ],
		[ 'membership-application-confirmation', 2 ],
		[ 'use-of-funds', 3 ],
		[ 'faq-page', 4 ],
	] )( 'highlights the correct navigation items', ( pageIdentifier: string, navItemIndex: number ) => {
		const wrapper = getWrapper( pageIdentifier );

		const link = wrapper.find( '.navigation-items li:nth-child(' + navItemIndex + ') .navigation-item' );
		expect( link.classes() ).toContain( 'active' );
		expect( link.attributes( 'aria-current' ) ).toStrictEqual( 'page' );
	} );

	it( 'hides the menu when keyup escape happens on the burger', async () => {
		const wrapper = getWrapper();
		const navigation = wrapper.find( '.navigation-items' );

		await wrapper.find( '.navigation-burger' ).trigger( 'click' );
		await wrapper.find( '.navigation-burger' ).trigger( 'keyup.esc' );

		expect( navigation.classes() ).not.toContain( 'active' );
	} );

	it( 'hides the menu when keyup escape happens on a menu item', async () => {
		const wrapper = getWrapper();
		const navigation = wrapper.find( '.navigation-items' );

		await wrapper.find( '.navigation-burger' ).trigger( 'click' );
		await wrapper.find( '.navigation-items .navigation-item:nth-child(1)' ).trigger( 'keyup.esc' );

		expect( navigation.classes() ).not.toContain( 'active' );
	} );

	it( 'toggles the menu when the burger is clicked', async () => {
		const wrapper = getWrapper();
		const navigation = wrapper.find( '.navigation-items' );

		await wrapper.find( '.navigation-burger' ).trigger( 'click' );

		expect( navigation.classes() ).toContain( 'active' );

		await wrapper.find( '.navigation-burger' ).trigger( 'click' );

		expect( navigation.classes() ).not.toContain( 'active' );
	} );

	it( 'hides the menu when the burger is blurred and no menu item is focused', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.navigation-burger' ).trigger( 'click' );
		await wrapper.find( '.navigation-burger' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.find( '.navigation-items' ).classes() ).not.toContain( 'active' );
	} );

	it( 'hides the menu when a menu item is blurred and no menu item is focused', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.navigation-burger' ).trigger( 'click' );
		await wrapper.find( '.navigation-items .navigation-item:nth-child(1)' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.find( '.navigation-items' ).classes() ).not.toContain( 'active' );
	} );

	it( 'does not hide the menu when the an item is blurred and a different menu item is focused', async () => {
		const wrapper = getWrapper();
		const contains = jest.fn().mockReturnValue( true );
		Object.defineProperty( document, 'activeElement', { value: { classList: { contains } } } );

		await wrapper.find( '.navigation-burger' ).trigger( 'click' );
		await wrapper.find( '.navigation-burger' ).trigger( 'blur' );
		await wrapper.find( '.navigation-items .navigation-item:nth-child(1)' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.find( '.navigation-items' ).classes() ).toContain( 'active' );
	} );

	it( 'shows the navigation menu in the correct place on large screens', async () => {
		Object.defineProperty( window, 'innerWidth', { value: 770 } );
		const wrapper = getWrapper();

		expect( wrapper.find( '.navigation > :nth-child(2)' ).classes() ).toContain( 'navigation-items' );
	} );

	it( 'shows the navigation menu in the correct place on small screens', async () => {
		Object.defineProperty( window, 'innerWidth', { value: 769 } );
		const wrapper = getWrapper();

		expect( wrapper.find( '.navigation > :nth-child(3)' ).classes() ).toContain( 'navigation-items' );
	} );
} );
