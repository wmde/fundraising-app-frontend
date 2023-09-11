import { mount } from '@vue/test-utils';
import LocaleSelector from '@src/components/shared/LocaleSelector.vue';
import Cookies from 'js-cookie';
import { COOKIE_NAME, DEFAULT_LOCALE } from '@src/createLocalisation';

describe( 'LocaleSelector.vue', () => {

	it( 'sets default locale if cookie is not set', () => {

		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( undefined );

		const wrapper = mount( LocaleSelector, { props: { assetsPath: '' } } );

		expect( ( wrapper.vm as any ).locale ).toEqual( DEFAULT_LOCALE );
	} );

	it( 'sets cookie locale if cookie is set', () => {
		const cookieValue = 'locale cookie';

		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( cookieValue );

		const wrapper = mount( LocaleSelector, { props: { assetsPath: '' } } );

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

		const wrapper = mount( LocaleSelector, { props: { assetsPath: '' } } );

		( wrapper.vm as any ).setCookie( cookieValue );

		expect( savedKey ).toEqual( COOKIE_NAME );
		expect( savedValue ).toEqual( cookieValue );
	} );

	it( 'reloads window on selection', () => {
		Object.defineProperty( window, 'location', {
			value: { reload: jest.fn() },
		} );

		const wrapper = mount( LocaleSelector, { props: { assetsPath: '' } } );

		( wrapper.vm as any ).setCookie( 'cookieValueOfTheLivingDead' );

		expect( window.location.reload ).toBeCalled();
	} );
} );
