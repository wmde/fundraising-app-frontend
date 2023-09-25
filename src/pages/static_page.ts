import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import StaticPage from '@src/components/pages/StaticPage.vue';
import { createNullFeatureFetcher } from '@src/FeatureFetcher';

const staticPage: any = document.getElementById( 'appdata' );
const PAGE_IDENTIFIER = staticPage.getAttribute( 'data-page-id' );
const pageData = new PageDataInitializer<any>( '#appdata' );

createVueApp( App, pageData.messages, createNullFeatureFetcher(), {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: StaticPage,
	pageProps: {
		pageId: staticPage.getAttribute( 'data-page-id' ),
		pageTitle: staticPage.getAttribute( 'data-page-title' ),
		pageContent: staticPage.getAttribute( 'data-page-content' ),
	},
} ).mount( '#app' );
