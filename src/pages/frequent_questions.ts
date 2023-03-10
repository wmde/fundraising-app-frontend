import 'core-js/stable';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import PageDataInitializer from '@/page_data_initializer';
import { createI18n } from '@/locales';
import App from '@/components/App.vue';

import Component from '@/components/pages/Faq.vue';
import Sidebar from '@/components/layout/Sidebar.vue';

import { faqContentFromObject } from '@/view_models/faq';

const PAGE_IDENTIFIER = 'faq-page';

Vue.config.productionTip = false;
Vue.use( VueI18n );

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
				content: faqContentFromObject( pageData.applicationVars ),
			},
		} ),
		h( Sidebar, {
			slot: 'sidebar',
		} ),
	] ),
} ).$mount( '#app' );
