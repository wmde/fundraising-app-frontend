import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import Error from '@src/components/pages/Error.vue';
import { createFeatureFetcher } from '@src/FeatureFetcher';

interface ErrorModel {
	message: string,
	trace: string,
}

const PAGE_IDENTIFIER = 'error-page';
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: Error,
	pageProps: {
		errorMessage: pageData.applicationVars.message,
		errorTrace: pageData.applicationVars.trace,
	},
} ).mount( '#app' );
