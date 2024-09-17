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
						:assets-path="assetsPath"
						:payment-amounts="paymentAmounts"
						:payment-intervals="paymentIntervals"
						:payment-types="paymentTypes"
					/>
					<PersonalDataSectionDonationReceipt
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
		</FeatureToggle>
	</div>
</template>

<script setup lang="ts">
import { TrackingData } from '@src/view_models/TrackingData';

import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import PaymentSection from '@src/components/pages/donation_form/singlePageFormSections/PaymentSection.vue';
import PersonalDataSection from '@src/components/pages/donation_form/singlePageFormSections/PersonalDataSection.vue';
import PersonalDataSectionDonationReceipt
	from '@src/components/pages/donation_form/singlePageFormSections/PersonalDataSectionDonationReceipt.vue';

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
	usesContentCards: true;
}
defineProps<Props>();

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.app-content-main.uses-cards {
	padding-top: 0;
}

.donation-page-form-section {
	background: colors.$white;
	border: 0;
	border-bottom: 1px solid colors.$primary;
	margin-bottom: 32px;
	padding: map.get( units.$spacing, 'small' );

	@include breakpoints.tablet-up {
		padding: map.get( units.$spacing, 'large' );
	}
}

</style>
