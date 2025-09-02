import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import Error from '@src/components/pages/Error.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import { windowPageTools } from '@src/util/PageTools';

interface ErrorModel {
	message: string;
	trace: string;
}

const PAGE_IDENTIFIER = 'error-page';
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp(
	App,
	pageData.messages,
	pageData.allowedCampaignParameters,
	featureFetcher,
	{
		assetsPath: pageData.assetsPath,
		bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
		pageIdentifier: PAGE_IDENTIFIER,
		page: Error,
		pageTitle: 'error_page_title',
		pageTools: windowPageTools,
		pageProps: {
			errorMessage: pageData.applicationVars.message,
			errorTrace: pageData.applicationVars.trace,
		},
	} ).mount( '#app' );
