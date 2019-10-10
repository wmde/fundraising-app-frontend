import Vue from 'vue';
import VueI18n from 'vue-i18n';
import PageDataInitializer from '@/page_data_initializer';
import { DEFAULT_LOCALE } from '@/locales';
import App from '@/components/App.vue';
import { createStore } from '@/store/donation_store';

import Component from '@/components/pages/DonationForm.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import { action } from '@/store/util';
import { NS_PAYMENT } from '@/store/namespaces';
import { initializePayment } from '@/store/payment/actionTypes';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import { bucketIdToCssClass } from '@/bucket_id_to_css_class';

const PAGE_IDENTIFIER = 'donation-form',
	COUNTRIES = [ 'DE', 'AT', 'CH', 'BE', 'IT', 'LI', 'LU' ];

Vue.config.productionTip = false;
Vue.use( VueI18n );

interface DonationFormModel {
	initialFormValues: any,
	presetAmounts: Array<string>,
	paymentTypes: Array<string>,
	paymentIntervals: Array<number>,
	tracking: Array<number>,
	urls: any
}

const pageData = new PageDataInitializer<DonationFormModel>( '#app' );
const store = createStore();

const i18n = new VueI18n( {
	locale: DEFAULT_LOCALE,
	messages: {
		[ DEFAULT_LOCALE ]: pageData.messages,
	},
} );

Vue.use( FeatureTogglePlugin, { activeFeatures: pageData.selectedBuckets } );

store.dispatch( action( NS_PAYMENT, initializePayment ), {
	// convert German-Formatted amount, see DonationFormPresenter
	amount: pageData.applicationVars.initialFormValues.amount.replace( ',', '' ).replace( /^000$/, '0' ),
	type: pageData.applicationVars.initialFormValues.paymentType,
	paymentIntervalInMonths: String( pageData.applicationVars.initialFormValues.paymentIntervalInMonths ),
	isCustomAmount: pageData.applicationVars.initialFormValues.isCustomAmount,
} ).then( paymentDataComplete => {

	new Vue( {
		store,
		i18n,
		render: h => h( App, {
			props: {
				assetsPath: pageData.assetsPath,
				pageIdentifier: PAGE_IDENTIFIER,
				validateAddressUrl: pageData.applicationVars.urls.validateAddress,
				validateAmountUrl: pageData.applicationVars.urls.validateDonationAmount,
				paymentAmounts: pageData.applicationVars.presetAmounts,
				paymentIntervals: pageData.applicationVars.paymentIntervals,
				paymentTypes: pageData.applicationVars.paymentTypes,
				addressCountries: COUNTRIES,
				trackingData: pageData.applicationVars.tracking,
				bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
			},
		},
		[
			h( Component, {
				props: {
					validateAddressUrl: pageData.applicationVars.urls.validateAddress,
					validateAmountUrl: pageData.applicationVars.urls.validateDonationAmount,
					validateBankDataUrl: pageData.applicationVars.urls.validateIban,
					validateLegacyBankDataUrl: pageData.applicationVars.urls.convertBankData,
					paymentAmounts: pageData.applicationVars.presetAmounts.map( a => Number( a ) * 100 ),
					paymentIntervals: pageData.applicationVars.paymentIntervals,
					paymentTypes: pageData.applicationVars.paymentTypes,
					addressCountries: COUNTRIES,
					trackingData: pageData.applicationVars.tracking,
					startPage: paymentDataComplete ? 'AddressPage' : 'PaymentPage',
				},
			} ),
			h( Sidebar, {
				slot: 'sidebar',
			} ),
		] ),
	} ).$mount( '#app' );

} );
