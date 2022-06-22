import 'core-js/stable';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueCompositionApi from '@vue/composition-api';
import PageDataInitializer from '@/page_data_initializer';
import { createI18n } from '@/locales';
import App from '@/components/App.vue';

import Component from '@/components/pages/PrivacyProtection.vue';
import Sidebar from '@/components/layout/Sidebar.vue';

const staticPage: any = document.getElementById( 'appdata' );
const PAGE_IDENTIFIER = staticPage.getAttribute( 'data-page-id' );

Vue.config.productionTip = false;
Vue.use( VueI18n );
Vue.use( VueCompositionApi );

const pageData = new PageDataInitializer<any>( '#appdata' );

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
