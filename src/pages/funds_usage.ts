import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import UseOfFunds from '@src/components/pages/UseOfFunds.vue';

const PAGE_IDENTIFIER = 'use-of-funds';
const pageData = new PageDataInitializer<any>( '#appdata' );

createVueApp( App, pageData.messages, {
	assetsPath: pageData.assetsPath,
	isFullWidth: true,
	pageIdentifier: PAGE_IDENTIFIER,
	page: UseOfFunds,
	pageProps: {
		content: pageData.applicationVars,
		assetsPath: pageData.assetsPath,
	},
} ).mount( '#app' );
