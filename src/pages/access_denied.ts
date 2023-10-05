import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import AccessDenied from '@src/components/pages/AccessDenied.vue';
import { createFeatureFetcher } from '@src/FeatureFetcher';

interface ErrorModel {
	message: string,
}

const PAGE_IDENTIFIER = 'access-denied';
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: AccessDenied,
	pageProps: {
		errorData: pageData.applicationVars,
	},
} ).mount( '#app' );
