import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import PrivacyProtection from '@src/components/pages/PrivacyProtection.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';

const staticPage: any = document.getElementById( 'appdata' );
const PAGE_IDENTIFIER = staticPage.getAttribute( 'data-page-id' );
const pageData = new PageDataInitializer<any>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: PrivacyProtection,
	pageProps: {
		pageId: staticPage.getAttribute( 'data-page-id' ),
		pageTitle: staticPage.getAttribute( 'data-page-title' ),
		pageContent: staticPage.getAttribute( 'data-page-content' ),
		trackingUrl: staticPage.getAttribute( 'data-tracking-url' ),
	},
} ).mount( '#app' );
