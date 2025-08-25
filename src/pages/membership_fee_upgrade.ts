import { createVueApp } from '@src/createVueApp';
import App from '@src/components/App.vue';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import PageDataInitializer from '@src/util/page_data_initializer';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import MembershipFeeUpgrade from '@src/components/pages/MembershipFeeUpgrade.vue';
import { createStore } from '@src/store/membership_store';

interface MembershipFeeUpgradeModel {
	presetAmounts: Array<string>;
	paymentIntervals: Array<string>;
	urls: any;
	uuid: string;
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
			validateFeeUrl: pageData.applicationVars.urls.validateMembershipFee,
			paymentAmounts: pageData.applicationVars.presetAmounts.map( a => Number( a ) * 100 ),
			paymentIntervals: pageData.applicationVars.paymentIntervals,
			uuid: pageData.applicationVars.uuid,
		},
	} );
app.use( store );
app.mount( '#app' );
