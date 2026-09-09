import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';

import LocalStorageRepository from '@src/store/LocalStorageRepository';
import PageDataInitializer from '@src/util/page_data_initializer';
import { YearlyMembershipFee } from '@src/view_models/MembershipFee';
import { clearPersistentData } from '@src/store/create_data_persister';
import { trackGoal } from '@src/util/tracking';

import App from '@src/components/App.vue';
import MembershipConfirmation from '@src/components/pages/MembershipConfirmation.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import type { MembershipApplicationConfirmationData } from '@src/Domain/Membership/MembershipApplicationConfirmationData';
import { ApiMembershipApplicantResource } from '@src/api/MembershipApplicantResource';
import { createStore } from '@src/store/donor_update_store';
import { action } from '@src/store/util';
import { addressTypeFromName } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import { ApiCityAutocompleteResource } from '@src/api/CityAutocompleteResource';

const PAGE_IDENTIFIER = 'membership-application-confirmation';
const LOCAL_STORAGE_DELETION_NAMESPACES = [ 'donation_form', 'membership_application' ];
const pageData = new PageDataInitializer<MembershipApplicationConfirmationData>( '#appdata' );
const yearlyFee = new YearlyMembershipFee(
	pageData.applicationVars.membershipApplication.paymentIntervalInMonths,
	pageData.applicationVars.membershipApplication.membershipFee
);
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );
const store = createStore();
const address = pageData.applicationVars.address;

clearPersistentData( new LocalStorageRepository(), LOCAL_STORAGE_DELETION_NAMESPACES );
trackGoal( pageData.applicationVars.piwik.membershipApplicationConfirmationGoalId, yearlyFee.yearlyFee );

console.log( pageData.applicationVars );
store.dispatch(
	action( 'address', 'initializeAddress' ),
	{
		addressType: addressTypeFromName( pageData.applicationVars.address.applicantType.toString() ),
		fields: [
			{ name: 'salutation', value: address.salutation ?? '', validity: Validity.INCOMPLETE },
			{ name: 'title', value: address.title ?? '', validity: Validity.INCOMPLETE },
			{ name: 'firstName', value: address.firstName ?? '', validity: Validity.INCOMPLETE },
			{ name: 'lastName', value: address.lastName ?? '', validity: Validity.INCOMPLETE },
			{ name: 'companyName', value: address.companyName ?? '', validity: Validity.INCOMPLETE },
			{ name: 'street', value: address.streetAddress ?? '', validity: Validity.INCOMPLETE },
			{ name: 'postcode', value: address.postalCode ?? '', validity: Validity.INCOMPLETE },
			{ name: 'city', value: address.city ?? '', validity: Validity.INCOMPLETE },
			{ name: 'country', value: address.countryCode ?? 'DE', validity: Validity.INCOMPLETE },
			{ name: 'email', value: address.email ?? '', validity: Validity.INCOMPLETE },
		],
	}
).then( () => {
	const app = createVueApp( App,
		pageData.messages,
		pageData.allowedCampaignParameters,
		featureFetcher,
		{
			assetsPath: pageData.assetsPath,
			bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
			hasSidebar: false,
			pageIdentifier: PAGE_IDENTIFIER,
			page: MembershipConfirmation,
			pageTitle: 'membership_application_confirmation_page_title',
			pageProps: {
				confirmationData: pageData.applicationVars,
				salutations: pageData.applicationVars.salutations,
				countries: pageData.applicationVars.countries,
				addressValidationPatterns: pageData.applicationVars.addressValidationPatterns,
				membership: pageData.applicationVars.membershipApplication,
				membershipApplicantResource: new ApiMembershipApplicantResource( pageData.applicationVars.urls.updateMembershipApplication ),
				addressType: pageData.applicationVars.address.applicantType,
				validateAddressUrl: pageData.applicationVars.urls.validateAddress,
				validateEmailUrl: pageData.applicationVars.urls.validateEmail,
			},
		} );
	app.use( store );
	app.provide( 'cityAutocompleteResource', new ApiCityAutocompleteResource() );
	app.mount( '#app' );
}
);
