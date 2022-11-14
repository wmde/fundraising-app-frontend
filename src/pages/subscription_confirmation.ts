import 'core-js/stable';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import PageDataInitializer from '@/page_data_initializer';
import { createI18n } from '@/locales';
import App from '@/components/App.vue';

import Component from '@/components/pages/SubscriptionConfirmation.vue';
import Sidebar from '@/components/layout/Sidebar.vue';

const PAGE_IDENTIFIER = 'subscription-confirmation';

Vue.config.productionTip = false;
Vue.use( VueI18n );

interface ErrorModel {
	error_message: string,
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
				errorMessage: pageData.applicationVars.error_message,
			},
		} ),
		h( Sidebar, {
			slot: 'sidebar',
		} ),
	] ),
} ).$mount( '#app' );
