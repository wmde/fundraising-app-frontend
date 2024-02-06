import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import UseOfFunds from '@src/components/pages/UseOfFunds.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';

const PAGE_IDENTIFIER = 'use-of-funds';
const pageData = new PageDataInitializer<any>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp(
	App,
	pageData.messages,
	pageData.allowedCampaignParameters,
	featureFetcher,
	{
		assetsPath: pageData.assetsPath,
		bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
		isFullWidth: true,
		pageIdentifier: PAGE_IDENTIFIER,
		page: UseOfFunds,
		pageProps: {
			content: JSON.parse( pageData.applicationVars.use_of_funds_content ),
			assetsPath: pageData.assetsPath,
		},
	} ).mount( '#app' );
