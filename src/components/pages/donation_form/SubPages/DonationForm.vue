<template>
	<PaymentSection
		:payment-amounts="paymentAmounts"
		:payment-intervals="paymentIntervals"
		:payment-types="paymentTypes"
	>
		<template #error-summary>
			<ErrorSummary :show-error-summary="showErrorSummary" :address-type="addressType"/>
		</template>
	</PaymentSection>

	<ContentCard v-if="isDirectDebitPayment">
		<template #content>
			<IbanFields/>
		</template>
	</ContentCard>

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
		@set-address-type="setAddressType( $event )"
	/>

	<ContentCard>
		<template #heading v-if="paymentSummary">
			<h2>{{ $t( 'donation_form_summary_title' ) }}</h2>
			<DonationSummaryHeadline
				:payment="paymentSummary"
			/>
		</template>
		<template #content>
			<Summary v-if="addressSummary || bankDataSummary">
				<template #left v-if="addressSummary">
					<DonorSummarySection
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
			<div class="switcher">
				<FormButton
					id="previous-btn"
					:is-outlined="true"
					@click="scrollToPaymentSection"
				>
					{{ $t( 'donation_form_section_back' ) }}
				</FormButton>
				<PaymentTextFormButton
					id="submit-btn"
					:is-loading="store.getters.isValidating"
					:payment-type="paymentSummary?.paymentType"
					@click="submit"
				/>
			</div>
		</template>
	</ContentCard>

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
import PaymentSection from '@src/components/pages/donation_form/FormSections/PaymentSection.vue';
import PersonalDataSection from '@src/components/pages/donation_form/FormSections/PersonalDataSection.vue';
import IbanFields from '@src/components/shared/IbanFields.vue';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import ErrorSummary from '@src/components/pages/donation_form/ErrorSummary.vue';
import { useDonationFormSubmitHandler } from '@src/components/pages/donation_form/useDonationFormSubmitHandler';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressTypeFunctions } from '@src/components/shared/composables/useAddressTypeFunctions';
import { trackDynamicForm } from '@src/util/tracking';
import { useBankDataSummary } from '@src/components/pages/donation_form/useBankDataSummary';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import Summary from '@src/components/patterns/Summary.vue';
import DonationSummaryHeadline from '@src/components/pages/donation_form/DonationSummaryHeadline.vue';
import DonorSummarySection from '@src/components/pages/donation_form/DonorSummarySection.vue';
import PaymentSummarySection from '@src/components/pages/donation_form/PaymentSummarySection.vue';

defineOptions( {
	name: 'DonationForm',
} );

const store = useStore();
const { bankDataSummary } = useBankDataSummary( store );
const { isDirectDebitPayment, paymentSummary } = usePaymentFunctions( store );

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

const { addressSummary } = useAddressSummary( store );
const {
	disabledAddressTypes,
	addressType,
	addressTypeIsInvalid,
	setAddressType,
} = useAddressTypeFunctions( store );

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

const { submit, submitValuesForm, showErrorSummary } = useDonationFormSubmitHandler(
	store,
	addressType,
	isDirectDebitPayment,
	props.validateAddressUrl,
	props.validateEmailUrl
);

const scrollToPaymentSection = () => {
	const scrollIntoViewElement = document.getElementById( 'payment-section-top-scroll-target' );
	if ( scrollIntoViewElement ) {
		scrollIntoViewElement.scrollIntoView( { behavior: 'auto' } );
	}
};

onMounted( () => {
	trackDynamicForm();
} );
</script>
