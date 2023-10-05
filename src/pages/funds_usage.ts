import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import UseOfFunds from '@src/components/pages/UseOfFunds.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';

const PAGE_IDENTIFIER = 'use-of-funds';
const pageData = new PageDataInitializer<any>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	isFullWidth: true,
	pageIdentifier: PAGE_IDENTIFIER,
	page: UseOfFunds,
	pageProps: {
		content: pageData.applicationVars,
		assetsPath: pageData.assetsPath,
	},
} ).mount( '#app' );
