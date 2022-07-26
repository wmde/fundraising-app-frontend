import 'core-js/stable';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import PageDataInitializer from '@/page_data_initializer';
import { createI18n } from '@/locales';
import App from '@/components/App.vue';

import Component from '@/components/pages/Supporters.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import { supportersFromObject } from '@/view_models/supporters';

const staticPage: any = document.getElementById( 'appdata' );
const PAGE_IDENTIFIER = 'supporters';

Vue.config.productionTip = false;
Vue.use( VueI18n );

interface ErrorModel {
	message: string,
	supporters: string,
}

const pageData = new PageDataInitializer<ErrorModel>( '#appdata' );

const i18n = createI18n( pageData.messages );

new Vue( {
	i18n,
	render: h => h( App, {
		props: {
			assetsPath: pageData.assetsPath,
			pageIdentifier: PAGE_IDENTIFIER,
			locale: i18n.locale,
		},
	},
	[
		h( Component, {
			props: {
				pageTitle: staticPage.getAttribute( 'data-page-title' ),
				supporters: supportersFromObject( pageData.applicationVars ),
			},
		} ),
		h( Sidebar, {
			slot: 'sidebar',
		} ),
	] ),
} ).$mount( '#app' );
