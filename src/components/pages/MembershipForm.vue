<template>
	<form name="laika-membership" ref="form" :action="`/apply-for-membership?${campaignParams}`" method="post">
		<keep-alive>
			<PaymentPage
				v-if="currentPageIndex === 0"
				@next-page="goToAddressPage"
				:validate-fee-url="validateFeeUrl"
				:payment-amounts="paymentAmounts"
				:validate-legacy-bank-data-url="validateLegacyBankDataUrl"
				:payment-intervals="paymentIntervals"
				:payment-types="paymentTypes"
				:validate-bank-data-url="validateBankDataUrl"
				:show-membership-type-option="showMembershipTypeOption"
			/>
			<AddressPage
				v-else
				@previous-page="goToPaymentPage"
				:campaign-values="campaignValues"
				:validate-email-url="validateEmailUrl"
				:validate-address-url="validateAddressUrl"
				:address-validation-patterns="addressValidationPatterns"
				:countries="countries"
				:date-of-birth-validation-pattern="dateOfBirthValidationPattern"
				:salutations="salutations"
				:tracking-data="trackingData"
			/>
		</keep-alive>
	</form>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { Country } from '@src/view_models/Country';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressValidation } from '@src/view_models/Validation';
import { TrackingData } from '@src/view_models/TrackingData';
import { Salutation } from '@src/view_models/Salutation';
import PaymentPage from '@src/components/pages/membership_form/subpages/PaymentPage.vue';
import AddressPage from '@src/components/pages/membership_form/subpages/AddressPage.vue';
import { HistoryHijacker, PopStateEvent } from '@src/util/HistoryHijacker';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

interface Props {
	validateAddressUrl: string;
	validateEmailUrl: string;
	validateBankDataUrl: string;
	validateLegacyBankDataUrl: string;
	validateFeeUrl: string;
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
	countries: Country[];
	salutations: Salutation[];
	showMembershipTypeOption: Boolean,
	addressValidationPatterns: AddressValidation;
	dateOfBirthValidationPattern: String,
	campaignValues: CampaignValues;
	trackingData: TrackingData
	historyHijacker: HistoryHijacker;
}

const AddressPageName = 'AddressPage';
const props = defineProps<Props>();
const currentPageIndex = ref<number>( 0 );
const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

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
