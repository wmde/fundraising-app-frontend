<template>
	<PaymentSection
		:payment-amounts="paymentAmounts"
		:payment-intervals="paymentIntervals"
		:payment-types="paymentTypes"
		:is-direct-debit-payment="isDirectDebitPayment"
	>
		<template #error-summary>
			<ErrorSummary :show-error-summary="showErrorSummary" :address-type="addressType" :receipt-needed="receiptNeeded"/>
		</template>
	</PaymentSection>

	<PersonalDataSection
		:countries="countries"
		:salutations="salutations"
		:tracking-data="trackingData"
		:campaign-values="campaignValues"
		:address-validation-patterns="addressValidationPatterns"
		:is-direct-debit-payment="isDirectDebitPayment"
		:disabled-address-types="disabledAddressTypes"
		:address-type="addressType"
		:address-type-is-invalid="addressTypeIsInvalid"
		:receipt-needed="receiptNeeded"
		@receipt-needed-toggled="receiptNeededToggled"
	/>

	<ContentCard :is-collapsable="true" v-if="paymentSummary">
		<template #content>
			<Accordion>
				<AccordionItem>
					<template #title><h2>{{ $t( 'donation_form_summary_title' ) }}</h2></template>
					<template #content>
						<div class="flow">
							<DonationSummaryHeadline
								:payment="paymentSummary"
							/>
							<Summary v-if="addressSummary || bankDataSummary">
								<template #left v-if="addressSummary">
									<AddressSummarySection
										:address="addressSummary"
										:countries="countries"
										:salutations="salutations"
									/>
								</template>
								<template #right v-if="bankDataSummary">
									<PaymentSummarySection
										:bank-data="bankDataSummary"
									/>
								</template>
							</Summary>
						</div>
					</template>
				</AccordionItem>
			</Accordion>
		</template>
	</ContentCard>

	<div>
		<PaymentTextFormButton
			id="submit-btn"
			:is-loading="store.getters.isValidating"
			:payment-type="paymentSummary?.paymentType"
			@click="submit"
		/>
	</div>

	<form :action="`/donation/add?${campaignParams}`" method="post" ref="submitValuesForm" id="submit-form" class="visually-hidden" aria-hidden="true">
		<SubmitValues :tracking-data="trackingData" :campaign-values="campaignValues"/>
	</form>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { useStore } from 'vuex';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { Country } from '@src/view_models/Country';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import PaymentSection from '@src/components/pages/donation_form/Compact/PaymentSection.vue';
import PersonalDataSection from '@src/components/pages/donation_form/Compact/PersonalDataSection.vue';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import ErrorSummary from '@src/components/pages/donation_form/Compact/ErrorSummary.vue';
import { useDonationFormSubmitHandler } from '@src/components/pages/donation_form/Compact/useDonationFormSubmitHandler';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressTypeFunctions } from '@src/components/shared/composables/useAddressTypeFunctions';
import { trackDynamicForm } from '@src/util/tracking';
import { useReceiptModel } from '@src/components/pages/donation_form/Compact/useReceiptModel';
import { useBankDataSummary } from '@src/components/pages/donation_form/useBankDataSummary';
import PaymentSummarySection from '@src/components/shared/PaymentSummarySection.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import AddressSummarySection from '@src/components/shared/AddressSummarySection.vue';
import DonationSummaryHeadline from '@src/components/pages/donation_form/DonationSummaryHeadline.vue';
import Summary from '@src/components/patterns/Summary.vue';
import AccordionItem from '@src/components/patterns/AccordionItem.vue';
import Accordion from '@src/components/patterns/Accordion.vue';

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

const store = useStore();
const { isDirectDebitPayment, paymentSummary } = usePaymentFunctions( store );
const { addressSummary } = useAddressSummary( store );
const { bankDataSummary } = useBankDataSummary( store );
const { disabledAddressTypes, addressType, addressTypeIsInvalid } = useAddressTypeFunctions( store );
const { receiptNeeded } = useReceiptModel( store );

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

const { submit, submitValuesForm, showErrorSummary } = useDonationFormSubmitHandler(
	store,
	isDirectDebitPayment,
	props.validateAddressUrl,
	props.validateEmailUrl
);

const receiptNeededToggled = ( newReceiptNeeded: boolean ): void => {
	receiptNeeded.value = newReceiptNeeded;
};

onMounted( () => {
	trackDynamicForm();
} );

</script>
