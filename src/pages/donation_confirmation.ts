import 'core-js/stable';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueCompositionApi from '@vue/composition-api';
import PageDataInitializer from '@/page_data_initializer';
import { createI18n } from '@/locales';
import { createStore } from '@/store/donor_update_store';
import { clearPersistentData } from '@/store/create_data_persister';
import LocalStorageRepository from '@/store/LocalStorageRepository';
import App from '@/components/App.vue';
import DonationConfirmation from '@/components/pages/DonationConfirmation.vue';
import { Country } from '@/view_models/Country';
import { Donation } from '@/view_models/Donation';
import { AddressValidation } from '@/view_models/Validation';
import { FeatureTogglePlugin } from '@/FeatureToggle';
import { ApiCityAutocompleteResource } from '@/CityAutocompleteResource';
import { Salutation } from '@/view_models/Salutation';
import { trackGoal } from '@/tracking';

const PAGE_IDENTIFIER = 'donation-confirmation',
	IS_FULLWIDTH_PAGE = true,
	LOCAL_STORAGE_DELETION_NAMESPACES = [ 'donation_form', 'membership_application' ];

Vue.config.productionTip = false;
Vue.use( VueI18n );
Vue.use( VueCompositionApi );

clearPersistentData( new LocalStorageRepository(), LOCAL_STORAGE_DELETION_NAMESPACES );

interface DonationConfirmationModel {
	urls: { [ key: string ]: string },
	countries: Array<Country>,
	donation: Donation,
	address: Object,
	addressType: String,
	addressValidationPatterns: AddressValidation,
	salutations: Array<Salutation>,
	piwik: { donationConfirmationGoalId: number; },
}

const pageData = new PageDataInitializer<DonationConfirmationModel>( '#appdata' );
const store = createStore();

const i18n = createI18n( pageData.messages );

trackGoal( pageData.applicationVars.piwik.donationConfirmationGoalId );

Vue.use( FeatureTogglePlugin, { activeFeatures: pageData.selectedBuckets } );

new Vue( {
	store,
	i18n,
	provide: {
		cityAutocompleteResource: new ApiCityAutocompleteResource(),
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
		h( DonationConfirmation, {
			props: {
				donation: pageData.applicationVars.donation,
				address: pageData.applicationVars.address,
				addressType: pageData.applicationVars.addressType,
				countries: pageData.applicationVars.countries,
				salutations: pageData.applicationVars.salutations,
				validateAddressUrl: pageData.applicationVars.urls.validateAddress,
				validateEmailUrl: pageData.applicationVars.urls.validateEmail,
				updateDonorUrl: pageData.applicationVars.urls.updateDonor,
				cancelDonationUrl: pageData.applicationVars.urls.cancelDonation,
				postCommentUrl: pageData.applicationVars.urls.postComment,
				addressValidationPatterns: pageData.applicationVars.addressValidationPatterns,
			},
		} ),
	] ),
} ).$mount( '#app' );
