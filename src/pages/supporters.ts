import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import { supportersFromObject } from '@src/view_models/supporters';
import App from '@src/components/App.vue';
import Supporters from '@src/components/pages/Supporters.vue';

interface ErrorModel {
	message: string,
	supporters: string,
}

const PAGE_IDENTIFIER = 'supporters';
const staticPage: any = document.getElementById( 'appdata' );
const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );

createVueApp( App, pageData.messages, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: Supporters,
	pageProps: {
		pageTitle: staticPage.getAttribute( 'data-page-title' ),
		supporters: supportersFromObject( pageData.applicationVars ),
	},
} ).mount( '#app' );
