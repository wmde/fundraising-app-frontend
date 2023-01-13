import 'core-js/stable';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
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
import { action } from '@/store/util';
import { NS_ADDRESS } from '@/store/namespaces';
import { initializeAddress } from '@/store/address/actionTypes';
import { addressTypeFromName } from '@/view_models/AddressTypeModel';
import { Address } from '@/view_models/Address';
import DonorResource from '@/api/DonorResource';

const PAGE_IDENTIFIER = 'donation-confirmation',
	IS_FULLWIDTH_PAGE = true,
	LOCAL_STORAGE_DELETION_NAMESPACES = [ 'donation_form', 'membership_application' ];

Vue.config.productionTip = false;
Vue.use( VueI18n );

clearPersistentData( new LocalStorageRepository(), LOCAL_STORAGE_DELETION_NAMESPACES );

interface DonationConfirmationModel {
	urls: { [ key: string ]: string },
	countries: Array<Country>,
	donation: Donation,
	address: Address,
	addressType: String,
	addressValidationPatterns: AddressValidation,
	salutations: Array<Salutation>,
	piwik: { donationConfirmationGoalId: number; },
}

const pageData = new PageDataInitializer<DonationConfirmationModel>( '#appdata' );
const store = createStore();

const i18n = createI18n( pageData.messages );

trackGoal( pageData.applicationVars.piwik.donationConfirmationGoalId );

Vue.use( FeatureTogglePlugin, { activeFeatures: [ ...pageData.selectedBuckets, ...pageData.activeFeatures ] } );

store.dispatch(
	action( NS_ADDRESS, initializeAddress ),
	{
		addressType: addressTypeFromName( pageData.applicationVars.addressType.toString() ),
		newsletter: pageData.applicationVars.donation.newsletter,
		fields: [
			{ name: 'salutation', value: pageData.applicationVars.address.salutation ?? '' },
			{ name: 'title', value: pageData.applicationVars.address.title ?? '' },
			{ name: 'firstName', value: pageData.applicationVars.address.firstName ?? '' },
			{ name: 'lastName', value: pageData.applicationVars.address.lastName ?? '' },
			{ name: 'companyName', value: pageData.applicationVars.address.companyName ?? '' },
			{ name: 'street', value: pageData.applicationVars.address.street ?? '' },
			{ name: 'postcode', value: pageData.applicationVars.address.postcode ?? '' },
			{ name: 'city', value: pageData.applicationVars.address.city ?? '' },
			{ name: 'country', value: pageData.applicationVars.address.country ?? 'DE' },
			{ name: 'email', value: pageData.applicationVars.address.email ?? '' },
		],
	}
).then( () => {
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
					cancelDonationUrl: pageData.applicationVars.urls.cancelDonation,
					postCommentUrl: pageData.applicationVars.urls.postComment,
					addressValidationPatterns: pageData.applicationVars.addressValidationPatterns,
					donorResource: new DonorResource( pageData.applicationVars.urls.updateDonor ),
				},
			} ),
		] ),
	} ).$mount( '#app' );
} );
