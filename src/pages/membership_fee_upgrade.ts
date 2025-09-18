import { createVueApp } from '@src/createVueApp';
import App from '@src/components/App.vue';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import PageDataInitializer from '@src/util/page_data_initializer';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import MembershipFeeUpgrade from '@src/components/pages/MembershipFeeUpgrade.vue';
import { createStore } from '@src/store/membership_store';
import SideBar from '@src/components/pages/membership_fee_change/SideBar.vue';
import { ApiBankValidationResource } from '@src/api/BankValidationResource';

interface MembershipFeeUpgradeModel {
	uuid: string;
	externalMemberId: number;
	currentAmountInCents: number;
	suggestedAmountInCents: number;
	currentInterval: string;
	feeChangeFrontendFlag: string;
	urls: any;
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
		sidebar: SideBar,
		pageTitle: 'membership_fee_upgrade_page_title',
		pageProps: {
			uuid: pageData.applicationVars.uuid,
			currentAmountInCents: pageData.applicationVars.currentAmountInCents,
			suggestedAmountInCents: pageData.applicationVars.suggestedAmountInCents,
			currentInterval: pageData.applicationVars.currentInterval,
			feeChangeFrontendFlag: pageData.applicationVars.feeChangeFrontendFlag,
		},
		sidebarProps: {
			externalMemberId: pageData.applicationVars.externalMemberId,
		},
	} );
app.use( store );
app.provide( 'bankValidationResource', new ApiBankValidationResource(
	pageData.applicationVars.urls.validateIban,
	pageData.applicationVars.urls.convertBankData
) );
app.mount( '#app' );
