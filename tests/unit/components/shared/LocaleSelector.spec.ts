import { createLocalVue, mount } from '@vue/test-utils';
import Buefy from 'buefy';
import CompositionAPI from '@vue/composition-api';
import LocaleSelector from '@/components/shared/LocaleSelector.vue';
import Cookies from 'js-cookie';
import { COOKIE_NAME, DEFAULT_LOCALE } from '@/locales';

const localVue = createLocalVue();
localVue.use( Buefy );
localVue.use( CompositionAPI );

describe( 'LocaleSelector.vue', () => {

	it( 'sets default locale if cookie is not set', () => {

		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( undefined );

		const wrapper = mount( LocaleSelector, {
			localVue,
			mocks: {
				$t: () => { },
			},
			propsData: { assetsPath: '' },
		} );

		expect( ( wrapper.vm as any ).locale ).toEqual( DEFAULT_LOCALE );
	} );

	it( 'sets cookie locale if cookie is set', () => {
		const cookieValue = 'locale cookie';

		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( cookieValue );

		const wrapper = mount( LocaleSelector, {
			localVue,
			mocks: {
				$t: () => { },
			},
			propsData: { assetsPath: '' },
		} );

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

		const wrapper = mount( LocaleSelector, {
			localVue,
			mocks: {
				$t: () => { },
			},
			propsData: { assetsPath: '' },
		} );

		( wrapper.vm as any ).setCookie( cookieValue );

		expect( savedKey ).toEqual( COOKIE_NAME );
		expect( savedValue ).toEqual( cookieValue );
	} );

	it( 'reloads window on selection', () => {
		Object.defineProperty( window, 'location', {
			value: { reload: jest.fn() },
		} );

		const wrapper = mount( LocaleSelector, {
			localVue,
			mocks: {
				$t: () => { },
			},
			propsData: { assetsPath: '' },
		} );

		( wrapper.vm as any ).setCookie( 'cookieValueOfTheLivingDead' );

		expect( window.location.reload ).toBeCalled();
	} );
} );
