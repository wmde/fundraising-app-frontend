<template>
	<div id="laika-membership">
		<keep-alive>
			<PaymentPage
				ref="paymentPage"
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
				ref="addressPage"
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
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { Country } from '@src/view_models/Country';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { AddressValidation } from '@src/view_models/Validation';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { Salutation } from '@src/view_models/Salutation';
import PaymentPage from '@src/components/pages/membership_form/subpages/PaymentPage.vue';
import AddressPage from '@src/components/pages/membership_form/subpages/AddressPage.vue';

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
	showMembershipTypeOption: Boolean;
	addressValidationPatterns: AddressValidation;
	dateOfBirthValidationPattern: String;
	campaignValues: CampaignValues;
	trackingData: TrackingData;
}

defineProps<Props>();
const currentPageIndex = ref<0 | 1>( 0 );
const addressPage = ref<HTMLElement>( null );
const paymentPage = ref<HTMLElement>( null );

const goToAddressPage = () => {
	currentPageIndex.value = 1;
};
const goToPaymentPage = () => {
	currentPageIndex.value = 0;
};

const focusFormPage = ( newPageIndex: 0 | 1 ): void => {
	if ( newPageIndex === 0 ) {
		paymentPage.value.focus();
	} else {
		addressPage.value.focus();
	}
};

watch( currentPageIndex, async ( newPageIndex: 0 | 1 ) => {
	window.scrollTo( 0, 0 );

	await nextTick();

	focusFormPage( newPageIndex );
} );

</script>
