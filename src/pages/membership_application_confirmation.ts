import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueCompositionApi from '@vue/composition-api';
import PageDataInitializer from '@/page_data_initializer';
import { createI18n } from '@/locales';
import App from '@/components/App.vue';
import Component from '@/components/pages/MembershipConfirmation.vue';
import { clearPersistentData } from '@/store/create_data_persister';
import LocalStorageRepository from '@/store/LocalStorageRepository';
import createCookieConsent from '@/cookie_consent';
import { trackGoal } from '@/tracking';
import { Salutation } from '@/view_models/Salutation';

const PAGE_IDENTIFIER = 'membership-application-confirmation',
	IS_FULLWIDTH_PAGE = true,
	LOCAL_STORAGE_DELETION_NAMESPACES = [ 'donation_form', 'membership_application' ];

Vue.config.productionTip = false;
Vue.use( VueI18n );
Vue.use( VueCompositionApi );

clearPersistentData( new LocalStorageRepository(), LOCAL_STORAGE_DELETION_NAMESPACES );

interface MembershipApplicationConfirmationModel {
	piwik: { membershipApplicationConfirmationGoalId: number; },
	salutations: Array<Salutation>,
}

const pageData = new PageDataInitializer<MembershipApplicationConfirmationModel>( '#appdata' );

const i18n = createI18n( pageData.messages );

trackGoal( pageData.applicationVars.piwik.membershipApplicationConfirmationGoalId );

new Vue( {
	i18n,
	provide: {
		cookieConsent: createCookieConsent( pageData.cookieConsent ),
	},
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
				confirmationData: pageData.applicationVars,
				salutations: pageData.applicationVars.salutations,
			},
		} ),
	] ),
} ).$mount( '#app' );
