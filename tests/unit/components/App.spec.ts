import { shallowMount } from '@vue/test-utils';
import App from '@src/components/App.vue';

describe( 'App.vue', () => {
	it( 'sets the document title on mounted', async () => {
		shallowMount( App, {
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

		expect( JSON.parse( document.title ) ).toStrictEqual(
			{
				'key': 'site_name',
				'pageTitle': '{"key":"test_page_title"}',
			} );
	} );
} );
