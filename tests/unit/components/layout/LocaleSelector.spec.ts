import { mount } from '@vue/test-utils';
import LocaleSelector from '@src/components/layout/LocaleSelector.vue';
import Cookies from 'js-cookie';
import { COOKIE_NAME, LOCALES } from '@src/util/createLocalisation';

const enLocale = LOCALES.find( x => x.value === 'en_GB' );
const deLocale = LOCALES.find( x => x.value === 'de_DE' );

describe( 'LocaleSelector.vue', () => {

	beforeEach( () => {
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'sets default locale if cookie is not set', () => {
		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( undefined );

		const wrapper = mount( LocaleSelector );

		expect( wrapper.find( '.navigation-locale-toggle' ).text() ).toStrictEqual( deLocale.abbreviation );
		expect( wrapper.find( '#navigation-locale-item-de_DE' ).element ).toBeChecked();
	} );

	it( 'sets cookie locale if cookie is set', () => {
		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( enLocale.value );

		const wrapper = mount( LocaleSelector );

		expect( wrapper.find( '.navigation-locale-toggle' ).text() ).toStrictEqual( enLocale.abbreviation );
		expect( wrapper.find( '#navigation-locale-item-en_GB' ).element ).toBeChecked();
	} );

	it( 'stores cookie on selection', async () => {
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

		await wrapper.find( '#navigation-locale-item-en_GB' ).trigger( 'change' );
		await wrapper.find( '.navigation-locale-dropdown' ).trigger( 'submit' );

		expect( savedKey ).toEqual( COOKIE_NAME );
		expect( savedValue ).toEqual( enLocale.value );
	} );

	it( 'reloads window on selection', async () => {
		Object.defineProperty( window, 'location', {
			value: { reload: jest.fn() },
		} );

		const wrapper = mount( LocaleSelector );

		await wrapper.find( '#navigation-locale-item-en_GB' ).trigger( 'change' );
		await wrapper.find( '.navigation-locale-dropdown' ).trigger( 'submit' );

		expect( window.location.reload ).toHaveBeenCalled();
	} );

	it( 'sets the form legend text based on selected language', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '#navigation-locale-item-en_GB' ).trigger( 'change' );
		expect( wrapper.find( '.navigation-locale-dropdown legend' ).text() ).toStrictEqual( enLocale.helpText );

		await wrapper.find( '#navigation-locale-item-de_DE' ).trigger( 'change' );
		expect( wrapper.find( '.navigation-locale-dropdown legend' ).text() ).toStrictEqual( deLocale.helpText );
	} );

	it( 'sets submit button text based on selected language', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '#navigation-locale-item-en_GB' ).trigger( 'change' );
		expect( wrapper.find( '.navigation-locale-button' ).text() ).toStrictEqual( enLocale.button );

		await wrapper.find( '#navigation-locale-item-de_DE' ).trigger( 'change' );
		expect( wrapper.find( '.navigation-locale-button' ).text() ).toStrictEqual( deLocale.button );
	} );

	it( 'toggles the popup when the toggle button is clicked', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );

		expect( wrapper.classes() ).toContain( 'active' );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );

		expect( wrapper.classes() ).not.toContain( 'active' );
	} );

	it( 'hides the popup when the toggle button emits keyup.esc', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );
		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'keyup.esc' );

		expect( wrapper.classes() ).not.toContain( 'active' );
	} );

	it( 'hides the popup when a radio element emits keyup.esc', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );
		await wrapper.find( '#navigation-locale-item-en_GB' ).trigger( 'keyup.esc' );

		expect( wrapper.classes() ).not.toContain( 'active' );
	} );

	it( 'hides the popup when the submit button emits keyup.esc', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );
		await wrapper.find( '.navigation-locale-button' ).trigger( 'keyup.esc' );

		expect( wrapper.classes() ).not.toContain( 'active' );
	} );

	it( 'hides the menu when the toggle is blurred and no other item is focused', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );
		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.classes() ).not.toContain( 'active' );
	} );

	it( 'hides the menu when a radio element is blurred and no other item is focused', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );
		await wrapper.find( '#navigation-locale-item-en_GB' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.classes() ).not.toContain( 'active' );
	} );

	it( 'hides the menu when the submit button is blurred and no other item is focused', async () => {
		const wrapper = mount( LocaleSelector );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );
		await wrapper.find( '.navigation-locale-button' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.classes() ).not.toContain( 'active' );
	} );

	it( 'does not hide the menu when the toggle is blurred and another locale selector item is focused', async () => {
		const wrapper = mount( LocaleSelector );
		const contains = jest.fn().mockReturnValue( true );
		Object.defineProperty( document, 'activeElement', { writable: true, configurable: true, value: { classList: { contains } } } );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );
		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'blur' );
		await wrapper.find( '#navigation-locale-item-en_GB' ).trigger( 'blur' );
		await wrapper.find( '.navigation-locale-button' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.classes() ).toContain( 'active' );
	} );

	it( 'does not hide the menu when a radio element is blurred but label text is selected', async () => {
		const wrapper = mount( LocaleSelector );
		const contains = jest.fn().mockReturnValue( true );
		const selection = { anchorNode: { parentElement: { classList: { contains } } } };
		Object.defineProperty( document, 'getSelection', { writable: true, configurable: true, value: selection } );

		await wrapper.find( '.navigation-locale-toggle' ).trigger( 'click' );
		await wrapper.find( '#navigation-locale-item-en_GB' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.classes() ).toContain( 'active' );
	} );
} );
