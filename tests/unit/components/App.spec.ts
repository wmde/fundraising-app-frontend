import { shallowMount, VueWrapper } from '@vue/test-utils';
import App from '@src/components/App.vue';
import { ModalStates, useModalState } from '@src/components/shared/composables/useModalState';
import { nextTick } from 'vue';

const modalState = useModalState();

describe( 'App.vue', () => {
	const getWrapper = (): VueWrapper<any> => {
		return shallowMount( App, {
			props: {
				assetsPath: 'http://localhost:7072',
				pageIdentifier: 'test-page',
				page: { name: 'TestName', template: '<span></span>' },
				pageTitle: 'test_page_title',
				pageProps: {},
				isFullWidth: false,
				bucketClasses: [],
				usesContentCards: false,
			},
		} );
	};

	it( 'sets the document title on mounted', async () => {
		getWrapper();

		expect( JSON.parse( document.title ) ).toStrictEqual(
			{
				'key': 'site_name',
				'pageTitle': '{"key":"test_page_title"}',
			} );
	} );

	it( 'freezes the page when a modal is opened', async () => {
		const scrollTo = jest.fn();
		Object.defineProperty( window, 'scrollTo', { writable: true, configurable: true, value: scrollTo } );
		modalState.value = ModalStates.Closed;
		getWrapper();

		modalState.value = ModalStates.Open;
		await nextTick();

		expect( document.body.style.position ).toStrictEqual( 'fixed' );
		expect( document.body.style.top ).toStrictEqual( '-0px' );

		modalState.value = ModalStates.Closed;
		await nextTick();

		expect( document.body.style.position ).toStrictEqual( '' );
		expect( document.body.style.top ).toStrictEqual( '' );
		expect( scrollTo ).toHaveBeenCalledWith( 0, 0 );
	} );
} );
