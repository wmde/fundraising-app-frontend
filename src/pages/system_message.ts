import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import SystemMessage from '@src/components/pages/SystemMessage.vue';

interface ErrorModel {
	message: string,
	locale: string,
}

const PAGE_IDENTIFIER = 'system-message';
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );

createVueApp( App, pageData.messages, [], {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: SystemMessage,
	pageProps: {
		errorData: pageData.applicationVars,
	},
} ).mount( '#app' );
