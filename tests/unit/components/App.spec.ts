import { shallowMount, VueWrapper } from '@vue/test-utils';
import App from '@src/components/App.vue';
import { ModalStates, useModalState } from '@src/components/shared/composables/useModalState';
import { nextTick } from 'vue';
import { PageTools } from '@src/util/PageTools';

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
				pageTools: {
					scrollTo: jest.fn(),
					setLocation: jest.fn(),
					reload: jest.fn(),
					setModalOpened: jest.fn(),
					setModalClosed: jest.fn(),
				},
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
		modalState.value = ModalStates.Closed;
		const wrapper = getWrapper();

		modalState.value = ModalStates.Open;
		await nextTick();

		const pageTools: PageTools = wrapper.props().pageTools;

		expect( pageTools.setModalOpened ).toHaveBeenCalled();

		modalState.value = ModalStates.Closed;
		await nextTick();

		expect( pageTools.setModalClosed ).toHaveBeenCalled();
	} );
} );
