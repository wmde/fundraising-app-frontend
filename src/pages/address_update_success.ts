import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import UpdateAddressSuccess from '@src/components/pages/UpdateAddressSuccess.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';

const PAGE_IDENTIFIER = 'address-update-success';
const pageData = new PageDataInitializer<any>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
	pageIdentifier: PAGE_IDENTIFIER,
	page: UpdateAddressSuccess,
	pageProps: {
		donationReceipt: pageData.applicationVars.receipt ? '1' : '0',
	},
} ).mount( '#app' );
