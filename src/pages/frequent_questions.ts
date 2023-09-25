import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import { faqContentFromObject } from '@src/view_models/faq';
import App from '@src/components/App.vue';
import Faq from '@src/components/pages/Faq.vue';
import { createNullFeatureFetcher } from '@src/FeatureFetcher';

const PAGE_IDENTIFIER = 'faq-page';
const pageData = new PageDataInitializer<any>( '#appdata' );

createVueApp( App, pageData.messages, createNullFeatureFetcher(), {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: Faq,
	pageProps: {
		content: faqContentFromObject( pageData.applicationVars ),
	},
} ).mount( '#app' );
