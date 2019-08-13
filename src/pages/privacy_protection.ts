import Vue from 'vue';
import VueI18n from 'vue-i18n';
import PageDataInitializer from '@/page_data_initializer';
import { DEFAULT_LOCALE } from '@/locales';
import App from '@/components/App.vue';

import Component from '@/components/pages/PrivacyProtection.vue';
import Sidebar from '@/components/layout/Sidebar.vue';

const staticPage: any = document.getElementById( 'app' );
const PAGE_IDENTIFIER = staticPage.getAttribute( 'data-page-id' );

Vue.config.productionTip = false;
Vue.use( VueI18n );

const pageData = new PageDataInitializer<any>( '#app' );

const i18n = new VueI18n( {
	locale: DEFAULT_LOCALE,
	messages: {
		[ DEFAULT_LOCALE ]: pageData.messages,
	},
} );

new Vue( {
	i18n,
	render: h => h( App, {
		props: {
			assetsPath: pageData.assetsPath,
			pageIdentifier: PAGE_IDENTIFIER,
		},
	},
	[
		h( Component, {
			props: {
				pageId: staticPage.getAttribute( 'data-page-id' ),
				pageTitle: staticPage.getAttribute( 'data-page-title' ),
				pageContent: staticPage.getAttribute( 'data-page-content' ),
				trackingUrl: staticPage.getAttribute( 'data-tracking-url' ),
			},
		} ),
		h( Sidebar, {
			slot: 'sidebar',
		} ),
	] ),
} ).$mount( '#app' );
