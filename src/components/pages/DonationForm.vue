<template>
	<FeatureToggle default-template="campaigns.address_pages.legacy">
		<template #campaigns.address_pages.legacy>
			<StandardDonationForm v-bind="props"/>
		</template>
		<template #campaigns.address_pages.test_02>
			<ReceiptDonationForm v-bind="props"/>
		</template>
	</FeatureToggle>
</template>

<script setup lang="ts">
import { TrackingData } from '@src/view_models/TrackingData';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import StandardDonationForm from '@src/components/pages/donation_form/SubPages/DonationForm.vue';
import ReceiptDonationForm from '@src/components/pages/donation_form/SubPages/DonationFormReceipt.vue';

defineOptions( {
	name: 'DonationForm',
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
const props = defineProps<Props>();

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
