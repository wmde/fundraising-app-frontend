import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';

import LocalStorageRepository from '@src/store/LocalStorageRepository';
import PageDataInitializer from '@src/util/page_data_initializer';
import { Salutation } from '@src/view_models/Salutation';
import { YearlyMembershipFee } from '@src/view_models/MembershipFee';
import { clearPersistentData } from '@src/store/create_data_persister';
import { trackGoal } from '@src/util/tracking';

import App from '@src/components/App.vue';
import MembershipConfirmation from '@src/components/pages/MembershipConfirmation.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';

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

const PAGE_IDENTIFIER = 'membership-application-confirmation';
const LOCAL_STORAGE_DELETION_NAMESPACES = [ 'donation_form', 'membership_application' ];
const pageData = new PageDataInitializer<MembershipApplicationConfirmationModel>( '#appdata' );
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
		usesContentCards: false,
		pageIdentifier: PAGE_IDENTIFIER,
		page: MembershipConfirmation,
		pageProps: {
			confirmationData: pageData.applicationVars,
			salutations: pageData.applicationVars.salutations,
		},
	} ).mount( '#app' );
