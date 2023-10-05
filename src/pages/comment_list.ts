import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import App from '@src/components/App.vue';
import CommentList from '@src/components/pages/CommentList.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';

const PAGE_IDENTIFIER = 'comment-list';
const pageData = new PageDataInitializer<any>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: CommentList,
	pageProps: {
		errorData: pageData.applicationVars,
	},
} ).mount( '#app' );
