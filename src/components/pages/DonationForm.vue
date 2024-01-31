<template>
	<div id="laika-donation">
		<FeatureToggle default-template="campaigns.address_pages.legacy">
			<template #campaigns.address_pages.legacy>
				<keep-alive>
					<PaymentPage
						v-if="currentPageIndex === 0"
						@next-page="goToAddressPage"
						:assets-path="assetsPath"
						:payment-amounts="paymentAmounts"
						:payment-intervals="paymentIntervals"
						:payment-types="paymentTypes"
					/>
					<AddressPage
						v-else
						@previous-page="goToPaymentPage"
						:assets-path="assetsPath"
						:validate-address-url="validateAddressUrl"
						:validate-email-url="validateEmailUrl"
						:validate-bank-data-url="validateBankDataUrl"
						:validate-legacy-bank-data-url="validateLegacyBankDataUrl"
						:countries="countries"
						:salutations="salutations"
						:tracking-data="trackingData"
						:campaign-values="campaignValues"
						:address-validation-patterns="addressValidationPatterns"
					/>
				</keep-alive>
			</template>
			<template #campaigns.address_pages.test_01>
				<keep-alive>
					<PaymentPage
						v-if="currentPageIndex === 0"
						@next-page="goToAddressPage"
						:assets-path="assetsPath"
						:payment-amounts="paymentAmounts"
						:payment-intervals="paymentIntervals"
						:payment-types="paymentTypes"
					/>
					<AddressPageDonationReceipt
						v-else
						@previous-page="goToPaymentPage"
						:assets-path="assetsPath"
						:validate-address-url="validateAddressUrl"
						:validate-email-url="validateEmailUrl"
						:validate-bank-data-url="validateBankDataUrl"
						:validate-legacy-bank-data-url="validateLegacyBankDataUrl"
						:countries="countries"
						:salutations="salutations"
						:tracking-data="trackingData"
						:campaign-values="campaignValues"
						:address-validation-patterns="addressValidationPatterns"
					/>
				</keep-alive>
			</template>
		</FeatureToggle>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { TrackingData } from '@src/view_models/TrackingData';
import PaymentPage from '@src/components/pages/donation_form/subpages/PaymentPage.vue';
import AddressPage from '@src/components/pages/donation_form/subpages/AddressPage.vue';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import AddressPageDonationReceipt from '@src/components/pages/donation_form/subpages/AddressPageDonationReceipt.vue';
import { HistoryHijacker, PopStateEvent } from '@src/util/HistoryHijacker';

interface Props {
	assetsPath: string;
	validateAddressUrl: string;
	validateEmailUrl: string;
	validateBankDataUrl: string;
	validateLegacyBankDataUrl: string;
	paymentAmounts: string[];
	paymentIntervals: number[];
	paymentTypes: string[];
	countries: Country[];
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
	addressValidationPatterns: AddressValidation;
	startPageIndex: number;
	historyHijacker: HistoryHijacker;
}

const AddressPageName = 'AddressPage';
const props = defineProps<Props>();
const currentPageIndex = ref<number>( props.startPageIndex );

watch( currentPageIndex, () => {
	window.scrollTo( 0, 0 );
} );

props.historyHijacker.addHistoryCallback( ( e: PopStateEvent ) => {
	// If the state is the address page then the user has hit the forward button after hitting back
	currentPageIndex.value = e.state === AddressPageName ? 1 : 0;
} );

const goToAddressPage = () => {
	currentPageIndex.value = 1;
	props.historyHijacker.addPushState( AddressPageName );
};

const goToPaymentPage = () => {
	currentPageIndex.value = 0;
	props.historyHijacker.back();
};

</script>
