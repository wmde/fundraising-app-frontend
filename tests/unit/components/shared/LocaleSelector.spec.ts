import { mount } from '@vue/test-utils';
import LocaleSelector from '@src/components/shared/LocaleSelector.vue';
import Cookies from 'js-cookie';
import { COOKIE_NAME, DEFAULT_LOCALE } from '@src/util/createLocalisation';

describe( 'LocaleSelector.vue', () => {

	it( 'sets default locale if cookie is not set', () => {

		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( undefined );

		const wrapper = mount( LocaleSelector );

		expect( ( wrapper.vm as any ).locale ).toEqual( DEFAULT_LOCALE );
	} );

	it( 'sets cookie locale if cookie is set', () => {
		const cookieValue = 'locale cookie';

		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( cookieValue );

		const wrapper = mount( LocaleSelector );

		expect( ( wrapper.vm as any ).locale ).toEqual( cookieValue );
	} );

	it( 'stores cookie on selection', () => {
		const cookieValue = 'cookieValueOfTheLivingDead';
		let savedKey = '';
		let savedValue: string | object = '';

		Object.defineProperty( window, 'location', {
			value: { reload: jest.fn() },
		} );

		jest.spyOn( Cookies, 'set' )
			.mockImplementation( ( name: string, value: string | object ): string | undefined => {
				savedKey = name;
				savedValue = value;
				return undefined;
			} );

		const wrapper = mount( LocaleSelector );

		( wrapper.vm as any ).setLocale( cookieValue );

		expect( savedKey ).toEqual( COOKIE_NAME );
		expect( savedValue ).toEqual( cookieValue );
	} );

	it( 'reloads window on selection', () => {
		Object.defineProperty( window, 'location', {
			value: { reload: jest.fn() },
		} );

		const wrapper = mount( LocaleSelector );

		( wrapper.vm as any ).setLocale( 'cookieValueOfTheLivingDead' );

		expect( window.location.reload ).toBeCalled();
	} );

	it.each( [
		[ 'Enter' ],
		[ ' ' ],
		[ 'ArrowUp' ],
		[ 'ArrowDown' ],
	] )( 'interacting with language indicator via key-board shows or hides drop-down', async ( keyFromUser: string ) => {
		const wrapper = mount( LocaleSelector );
		const button = wrapper.find( '.navigation-locale-current' );
		const dropdown = wrapper.find( '.navigation-locale-dropdown' );

		expect( button.attributes( 'aria-expanded' ) ).toBe( 'false' );
		expect( dropdown.isVisible() ).toBeFalsy();

		await button.trigger( 'keydown', { key: keyFromUser } );

		expect( button.attributes( 'aria-expanded' ) ).toBe( 'true' );
		expect( dropdown.isVisible() ).toBeTruthy();

		await button.trigger( 'keydown', { key: 'Escape' } );

		expect( button.attributes( 'aria-expanded' ) ).toBe( 'false' );
		expect( dropdown.isVisible() ).toBeFalsy();
	} );

	it( 'interacting with language indicator via mouse shows or hides drop-down', async () => {
		const wrapper = mount( LocaleSelector );
		const dropdown = wrapper.find( '.navigation-locale-dropdown' );
		const button = wrapper.find( '.navigation-locale-current' );

		expect( button.attributes( 'aria-expanded' ) ).toBe( 'false' );
		expect( dropdown.isVisible() ).toBeFalsy();

		await button.trigger( 'click' );

		expect( button.attributes( 'aria-expanded' ) ).toBe( 'true' );
		expect( dropdown.isVisible() ).toBeTruthy();

		await button.trigger( 'click' );

		expect( button.attributes( 'aria-expanded' ) ).toBe( 'false' );
		expect( dropdown.isVisible() ).toBeFalsy();
	} );

	it.each( [
		[ 'Enter', 1 ],
		[ ' ', 1 ],
		[ 'ArrowUp', 2 ],
		[ 'ArrowDown', 1 ],
	] )( 'interacting with language indicator via keyboard changes the focus in drop-down options', async ( keyFromUser: string, focusedIndex: number ) => {
		const wrapper = mount( LocaleSelector );
		const button = wrapper.find( '.navigation-locale-current' );

		await button.trigger( 'keydown', { key: keyFromUser } );

		const focusedItem = wrapper.find( `.navigation-locale-dropdown li:nth-child(${focusedIndex}) a.focus` );
		expect( focusedItem.exists() ).toBeTruthy();
	} );

	it( 'closes the popup when Shift + Tab is pressed', async () => {
		const wrapper = mount( LocaleSelector );
		const dropdown = wrapper.find( '.navigation-locale-dropdown' );
		const button = wrapper.find( '.navigation-locale-current' );

		await button.trigger( 'click' );

		expect( dropdown.isVisible() ).toBeTruthy();

		await wrapper.find( '.navigation-locale-dropdown li:last-child' ).trigger( 'keydown', { key: 'Tab', shiftKey: true } );

		expect( dropdown.isVisible() ).toBeFalsy();
	} );

	it.each( [
		[ 'Enter' ],
		[ ' ' ],
	] )( 'selecting an item in the drop-down stores the locale and triggers reload', async ( keyFromUser ) => {
		let savedValue: string | object = '';
		Object.defineProperty( window, 'location', {
			value: { reload: jest.fn() },
		} );

		jest.spyOn( Cookies, 'set' )
			.mockImplementation( ( name: string, value: string | object ): string | undefined => {
				savedValue = value;
				return undefined;
			} );

		const wrapper = mount( LocaleSelector );
		const menu = wrapper.find( '.navigation-locale-dropdown' );
		const button = wrapper.find( '.navigation-locale-current' );

		const event = { key: keyFromUser };

		await button.trigger( 'click' );
		await menu.trigger( 'keydown', event );

		expect( menu.isVisible() ).toBeFalsy();
		expect( savedValue ).toBe( 'de_DE' );
		expect( window.location.reload ).toHaveBeenCalled();
	} );
} );
