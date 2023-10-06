import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import DonationCancellation from '@src/components/pages/DonationCancellation.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';

interface ErrorModel {
	message: string
}

const PAGE_IDENTIFIER = 'donation-cancellation-confirmation';
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
	pageIdentifier: PAGE_IDENTIFIER,
	page: DonationCancellation,
	pageProps: {
		cancellationData: pageData.applicationVars,
	},
} ).mount( '#app' );
