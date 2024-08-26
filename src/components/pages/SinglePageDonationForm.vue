<template>
	<div id="laika-donation">
		<FeatureToggle default-template="campaigns.address_pages.legacy">
			<template #campaigns.address_pages.legacy>
					<PaymentSection
						:assets-path="assetsPath"
						:payment-amounts="paymentAmounts"
						:payment-intervals="paymentIntervals"
						:payment-types="paymentTypes"
					/>
					<PersonalDataSection
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
			<template #campaigns.address_pages.test_02>
					<PaymentSection
						ref="paymentPage"
						@next-page="currentPageIndex = 1"
						:assets-path="assetsPath"
						:payment-amounts="paymentAmounts"
						:payment-intervals="paymentIntervals"
						:payment-types="paymentTypes"
					/>
					TODO add addresspagedonationreceipt section here
			</template>
		</FeatureToggle>
	</div>
</template>

<script setup lang="ts">
import { TrackingData } from '@src/view_models/TrackingData';

import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import AddressPageDonationReceipt from '@src/components/pages/donation_form/subpages/AddressPageDonationReceipt.vue';
import PaymentSection from '@src/components/pages/donation_form/formPageSections/PaymentSection.vue';
import PersonalDataSection from '@src/components/pages/donation_form/formPageSections/PersonalDataSection.vue';

defineOptions( {
	name: 'SinglePageDonationForm',
} );

interface Props {
	assetsPath: string;
	validateAddressUrl: string;
	validateEmailUrl: string;
	validateBankDataUrl: string;
	validateLegacyBankDataUrl: string;
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
	countries: Country[];
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
	addressValidationPatterns: AddressValidation;
}
defineProps<Props>();

</script>
