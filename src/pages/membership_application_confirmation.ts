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
import { windowPageTools } from '@src/util/PageTools';

const PAGE_IDENTIFIER = 'membership-application-confirmation';
const LOCAL_STORAGE_DELETION_NAMESPACES = [ 'donation_form', 'membership_application' ];
const pageData = new PageDataInitializer<MembershipApplicationConfirmationData>( '#appdata' );
const yearlyFee = new YearlyMembershipFee(
	pageData.applicationVars.membershipApplication.paymentIntervalInMonths,
	pageData.applicationVars.membershipApplication.membershipFee
);
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

clearPersistentData( new LocalStorageRepository(), LOCAL_STORAGE_DELETION_NAMESPACES );
trackGoal( pageData.applicationVars.piwik.membershipApplicationConfirmationGoalId, yearlyFee.yearlyFee );

createVueApp( App,
	pageData.messages,
	pageData.allowedCampaignParameters,
	featureFetcher,
	{
		assetsPath: pageData.assetsPath,
		bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
		isFullWidth: true,
		usesContentCards: true,
		pageIdentifier: PAGE_IDENTIFIER,
		page: MembershipConfirmation,
		pageTitle: 'membership_application_confirmation_page_title',
		pageTools: windowPageTools,
		pageProps: {
			confirmationData: pageData.applicationVars,
			salutations: pageData.applicationVars.salutations,
			countries: pageData.applicationVars.countries,
		},
	} ).mount( '#app' );
