import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import { faqContentFromObject } from '@src/view_models/faq';
import App from '@src/components/App.vue';
import Faq from '@src/components/pages/Faq.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import { windowPageTools } from '@src/util/PageTools';

const PAGE_IDENTIFIER = 'faq-page';
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
		pageIdentifier: PAGE_IDENTIFIER,
		page: Faq,
		pageTitle: 'faq_page_title',
		pageTools: windowPageTools,
		pageProps: {
			content: faqContentFromObject( JSON.parse( pageData.applicationVars.faq_content ) ),
		},
	}
).mount( '#app' );
