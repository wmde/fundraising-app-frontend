import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import { supportersFromObject } from '@src/view_models/supporters';
import App from '@src/components/App.vue';
import Supporters from '@src/components/pages/Supporters.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import { windowPageTools } from '@src/util/PageTools';

interface ErrorModel {
	message: string;
	supporters: string;
}

const PAGE_IDENTIFIER = 'supporters';
const staticPage: any = document.getElementById( 'appdata' );
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App,
	pageData.messages,
	pageData.allowedCampaignParameters,
	featureFetcher,
	{
		assetsPath: pageData.assetsPath,
		bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
		pageIdentifier: PAGE_IDENTIFIER,
		page: Supporters,
		pageTitle: staticPage.getAttribute( 'data-page-title' ),
		pageTools: windowPageTools,
		pageProps: {
			pageTitle: staticPage.getAttribute( 'data-page-title' ),
			supporters: supportersFromObject( JSON.parse( pageData.applicationVars.supporters ) ),
		},
	} ).mount( '#app' );
