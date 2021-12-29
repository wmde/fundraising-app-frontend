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
import { YearlyMembershipFee } from '@/view_models/MembershipFee';

const PAGE_IDENTIFIER = 'membership-application-confirmation',
	IS_FULLWIDTH_PAGE = true,
	LOCAL_STORAGE_DELETION_NAMESPACES = [ 'donation_form', 'membership_application' ];

Vue.config.productionTip = false;
Vue.use( VueI18n );
Vue.use( VueCompositionApi );

clearPersistentData( new LocalStorageRepository(), LOCAL_STORAGE_DELETION_NAMESPACES );

// TODO move this model, see https://phabricator.wikimedia.org/T298372
interface MembershipApplicationConfirmationModel {
	piwik: { membershipApplicationConfirmationGoalId: number; },
	salutations: Array<Salutation>,
	membershipApplication: {
		paymentIntervalInMonths: string|number,
		membershipFee: string|number,
		paymentType: string,
		// TODO The incentive array and serialization is not properly defined
		//      The summary page displays a fixed string when length > 0
		incentives: any[]
	},
	// TODO add address property, see MembershipSummary.vue
}

const pageData = new PageDataInitializer<MembershipApplicationConfirmationModel>( '#appdata' );

const i18n = createI18n( pageData.messages );

const yearlyFee = new YearlyMembershipFee(
	pageData.applicationVars.membershipApplication.paymentIntervalInMonths,
	pageData.applicationVars.membershipApplication.membershipFee
);
trackGoal( pageData.applicationVars.piwik.membershipApplicationConfirmationGoalId, yearlyFee.yearlyFee );

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
