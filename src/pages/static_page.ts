import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import StaticPage from '@src/components/pages/StaticPage.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';

const staticPage: any = document.getElementById( 'appdata' );
const PAGE_IDENTIFIER = staticPage.getAttribute( 'data-page-id' );
const pageData = new PageDataInitializer<any>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App,
	pageData.messages,
	pageData.allowedCampaignParameters,
	featureFetcher,
	{
		assetsPath: pageData.assetsPath,
		bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
		pageIdentifier: PAGE_IDENTIFIER,
		page: StaticPage,
		pageProps: {
			pageId: staticPage.getAttribute( 'data-page-id' ),
			pageTitle: staticPage.getAttribute( 'data-page-title' ),
			pageContent: staticPage.getAttribute( 'data-page-content' ),
		},
	} ).mount( '#app' );
