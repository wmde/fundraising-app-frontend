<template>
	<div id="laika-donation">
		<FeatureToggle default-template="campaigns.address_pages.legacy">
			<template #campaigns.address_pages.legacy>
				<keep-alive>
					<PaymentPage
						v-if="currentPageIndex === 0"
						ref="paymentPage"
						@next-page="currentPageIndex = 1"
						:assets-path="assetsPath"
						:payment-amounts="paymentAmounts"
						:payment-intervals="paymentIntervals"
						:payment-types="paymentTypes"
					/>
					<AddressPage
						v-else
						ref="addressPage"
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
				</keep-alive>
			</template>
			<template #campaigns.address_pages.test_02>
				<keep-alive>
					<PaymentPage
						v-if="currentPageIndex === 0"
						ref="paymentPage"
						@next-page="currentPageIndex = 1"
						:assets-path="assetsPath"
						:payment-amounts="paymentAmounts"
						:payment-intervals="paymentIntervals"
						:payment-types="paymentTypes"
					/>
					<AddressPageDonationReceipt
						v-else
						ref="addressPage"
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
				</keep-alive>
			</template>
		</FeatureToggle>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { TrackingData } from '@src/view_models/TrackingData';
import PaymentPage from '@src/components/pages/donation_form/subpages/PaymentPage.vue';
import AddressPage from '@src/components/pages/donation_form/subpages/AddressPage.vue';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import AddressPageDonationReceipt from '@src/components/pages/donation_form/subpages/AddressPageDonationReceipt.vue';

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
	startPageIndex: 0 | 1;
}

const props = defineProps<Props>();

const currentPageIndex = ref<0 | 1>( props.startPageIndex );
const addressPage = ref<HTMLElement>( null );
const paymentPage = ref<HTMLElement>( null );

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
