import Vue from 'vue';
import VueI18n from 'vue-i18n';
import PageDataInitializer from '@/page_data_initializer';
import { DEFAULT_LOCALE } from '@/locales';
import App from '@/components/App.vue';

import Component from '@/components/pages/DonationConfirmation.vue';

const PAGE_IDENTIFIER = 'donation-confirmation',
	IS_FULLWIDTH_PAGE = true;

Vue.config.productionTip = false;
Vue.use( VueI18n );

const pageData = new PageDataInitializer<any>( '#app' );

console.log ( pageData );

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
			isFullWidth: IS_FULLWIDTH_PAGE,
		},
	},
	[
		h( Component, {
			props: {
				confirmationData: pageData.applicationVars,
			},
		} ),
	] ),
} ).$mount( '#app' );
