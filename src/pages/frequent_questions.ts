import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import { faqContentFromObject } from '@src/view_models/faq';
import App from '@src/components/App.vue';
import Faq from '@src/components/pages/Faq.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';

const PAGE_IDENTIFIER = 'faq-page';
const pageData = new PageDataInitializer<any>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: Faq,
	pageProps: {
		content: faqContentFromObject( pageData.applicationVars ),
	},
} ).mount( '#app' );
