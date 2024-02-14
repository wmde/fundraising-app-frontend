<template>
	<div id="laika-donation">
		<h1 class="form-title" v-html="$t( 'donation_form_section_address_headline' )"/>
		<FormAccordion :page-index="currentPageIndex" :start-payment-complete="paymentDataComplete">
			<template #payment-title>Step 01. Payment Information</template>
			<template #payment-content>
				<PaymentPage
					@next-page="currentPageIndex = 1"
					:assets-path="assetsPath"
					:payment-amounts="paymentAmounts"
					:payment-intervals="paymentIntervals"
					:payment-types="paymentTypes"
				/>
			</template>

			<template #address-title>Step 02. Address Information</template>
			<template #address-content>
				<AddressPage
					@previous-page="currentPageIndex = 0"
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
			</template>
		</FormAccordion>

	</div>
</template>

<script setup lang="ts">
import { TrackingData } from '@src/view_models/TrackingData';
import PaymentPage from '@src/components/pages/donation_form/subpages/PaymentPage.vue';
import AddressPage from '@src/components/pages/donation_form/subpages/AddressPage.vue';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import FormAccordion from '@src/components/shared/FormAccordion.vue';
import { ref } from 'vue';

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
	paymentDataComplete: boolean;
}

const props = defineProps<Props>();
const currentPageIndex = ref<number>( props.paymentDataComplete ? 1 : 0 );

</script>
