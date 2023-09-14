import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import UpdateAddressSuccess from '@src/components/pages/UpdateAddressSuccess.vue';

const PAGE_IDENTIFIER = 'address-update-success';
const pageData = new PageDataInitializer<any>( '#appdata' );

createVueApp( App, pageData.messages, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: UpdateAddressSuccess,
	pageProps: {
		donationReceipt: pageData.applicationVars.receipt ? '1' : '0',
	},
} ).mount( '#app' );
