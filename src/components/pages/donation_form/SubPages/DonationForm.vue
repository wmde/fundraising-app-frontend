<template>
	<div id="laika-donation">
		<PaymentSection
			:payment-amounts="paymentAmounts"
			:payment-intervals="paymentIntervals"
			:payment-types="paymentTypes"
		>
			<template #error-summary>
				<ErrorSummary :show-error-summary="showErrorSummary" :address-type="addressType"/>
			</template>
		</PaymentSection>
		<div class="donation-page-form-section" v-if="isDirectDebitPayment">
			<IbanFields/>
		</div>
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

		<div class="donation-page-form-section">
			<FormSummary>
				<template #summary-content>
					<DonationSummary
						:payment="paymentSummary"
						:address-type="addressTypeName"
						:address="addressSummary"
						:countries="countries"
						:salutations="salutations"
						:language-item="inlineSummaryLanguageItem"
					/>
				</template>

				<template #summary-buttons>
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
						:payment-type="paymentSummary.paymentType"
						@click="submit"
					/>
				</template>

			</FormSummary>

			<form :action="`/donation/add?${campaignParams}`" method="post" ref="submitValuesForm" id="submit-form">
				<SubmitValues :tracking-data="trackingData" :campaign-values="campaignValues"/>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { useStore } from 'vuex';
import { TrackingData } from '@src/view_models/TrackingData';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import PaymentSection from '@src/components/pages/donation_form/FormSections/PaymentSection.vue';
import PersonalDataSection from '@src/components/pages/donation_form/FormSections/PersonalDataSection.vue';
import IbanFields from '@src/components/shared/IbanFields.vue';
import DonationSummary from '@src/components/pages/donation_form/DonationSummary.vue';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import ErrorSummary from '@src/components/pages/donation_form/ErrorSummary.vue';
import { useDonationFormSubmitHandler } from '@src/components/pages/donation_form/useDonationFormSubmitHandler';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressTypeFunctions } from '@src/components/shared/composables/useAddressTypeFunctions';
import { trackDynamicForm } from '@src/util/tracking';

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
const { addressSummary, inlineSummaryLanguageItem } = useAddressSummary( store );
const {
	disabledAddressTypes,
	addressType,
	addressTypeIsInvalid,
	addressTypeName,
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
