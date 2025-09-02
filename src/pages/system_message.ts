import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import SystemMessage from '@src/components/pages/SystemMessage.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import { windowPageTools } from '@src/util/PageTools';

interface ErrorModel {
	message: string;
	locale: string;
}

const PAGE_IDENTIFIER = 'system-message';
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
		page: SystemMessage,
		pageTitle: 'system_message_page_title',
		pageTools: windowPageTools,
		pageProps: {
			errorData: pageData.applicationVars,
		},
	} ).mount( '#app' );
