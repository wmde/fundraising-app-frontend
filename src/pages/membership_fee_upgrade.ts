import { createVueApp } from '@src/createVueApp';
import App from '@src/components/App.vue';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import PageDataInitializer from '@src/util/page_data_initializer';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import MembershipFeeUpgrade from '@src/components/pages/MembershipFeeUpgrade.vue';
import { createStore } from '@src/store/membership_store';

interface MembershipFeeUpgradeModel {
	uuid: string;
	externalMemberId: number;
	currentAmountInCents: number;
	suggestedAmountInCents: number;
	currentInterval: string;
	showErrorPageInstead: boolean;
}

const PAGE_IDENTIFIER = 'membership-fee-upgrade';
const pageData = new PageDataInitializer<MembershipFeeUpgradeModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );
const store = createStore();

const app = createVueApp(
	App,
	pageData.messages,
	pageData.allowedCampaignParameters,
	featureFetcher,
	{
		assetsPath: pageData.assetsPath,
		bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
		pageIdentifier: PAGE_IDENTIFIER,
		page: MembershipFeeUpgrade,
		pageTitle: 'membership_fee_upgrade_page_title',
		pageProps: {
			uuid: pageData.applicationVars.uuid,
			externalMemberId: pageData.applicationVars.externalMemberId,
			//TODO check if the following values need a "* 100" added
			currentAmountInCents: pageData.applicationVars.currentAmountInCents,
			suggestedAmountInCents: pageData.applicationVars.suggestedAmountInCents,
			currentInterval: pageData.applicationVars.currentInterval,
			showErrorPageInstead: pageData.applicationVars.showErrorPageInstead
		},
	} );
app.use( store );
app.mount( '#app' );
