import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import SubscriptionConfirmation from '@src/components/pages/SubscriptionConfirmation.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';

interface ErrorModel {
	error_message: string,
}

const PAGE_IDENTIFIER = 'subscription-confirmation';
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: SubscriptionConfirmation,
	pageProps: {
		errorMessage: pageData.applicationVars.error_message,
	},
} ).mount( '#app' );
