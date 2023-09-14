import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import DonationCancellation from '@src/components/pages/DonationCancellation.vue';

interface ErrorModel {
	message: string
}

const PAGE_IDENTIFIER = 'donation-cancellation-confirmation';
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );

createVueApp( App, pageData.messages, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: DonationCancellation,
	pageProps: {
		cancellationData: pageData.applicationVars,
	},
} ).mount( '#app' );
