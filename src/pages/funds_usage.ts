import 'core-js/stable';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import PageDataInitializer from '@/page_data_initializer';
import { createI18n } from '@/locales';
import App from '@/components/App.vue';
import VueCompositionApi from '@vue/composition-api';

import Component from '@/components/pages/UseOfFunds.vue';

const PAGE_IDENTIFIER = 'use-of-funds',
	IS_FULLWIDTH_PAGE = true;

Vue.config.productionTip = false;
Vue.use( VueCompositionApi );
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
			isFullWidth: IS_FULLWIDTH_PAGE,
			locale: i18n.locale,
		},
	},
	[
		h( Component, {
			props: {
				content: pageData.applicationVars,
				assetsPath: pageData.assetsPath,
			},
		} ),
	] ),
} ).$mount( '#app' );
