import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import PageNotFound from '@src/components/pages/PageNotFound.vue';
import { createNullFeatureFetcher } from '@src/FeatureFetcher';

interface ErrorModel {
	message: string,
	locale: string,
}

const PAGE_IDENTIFIER = 'page-not-found';
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );

createVueApp( App, pageData.messages, createNullFeatureFetcher(), {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: PageNotFound,
	pageProps: {
		errorData: pageData.applicationVars,
	},
} ).mount( '#app' );
