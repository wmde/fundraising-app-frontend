<template>
	<FeatureToggle default-template="campaigns.address_pages.legacy">
		<template #campaigns.address_pages.legacy>
			<FeatureToggle default-template="campaigns.address_type_choice.default">
				<template #campaigns.address_type_choice.default>
					<StandardDonationForm v-bind="props"/>
				</template>
				<template #campaigns.address_type_choice.choice>
					<ChoiceDonationForm v-bind="props" />
				</template>
			</FeatureToggle>
		</template>
		<template #campaigns.address_pages.test_02>
			<ReceiptDonationForm v-bind="props"/>
		</template>
	</FeatureToggle>
</template>

<script setup lang="ts">
import type { TrackingData } from '@src/view_models/TrackingData';
import type { Country } from '@src/view_models/Country';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import StandardDonationForm from '@src/components/pages/donation_form/SubPages/DonationForm.vue';
import ReceiptDonationForm from '@src/components/pages/donation_form/SubPages/DonationFormReceipt.vue';
import ChoiceDonationForm from '@src/components/pages/donation_form/SubPages/DonationFormAnonymousChoice.vue';

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
