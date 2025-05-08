<template>
	<div id="laika-donation">
		<PaymentSection
			:payment-amounts="paymentAmounts"
			:payment-intervals="paymentIntervals"
			:payment-types="paymentTypes"
		>
			<template #error-summary>
				<OptOutErrorSummary :show-error-summary="showErrorSummary" v-if="addressOptOut.addressOptIn.value === null" />
				<ErrorSummary :show-error-summary="showErrorSummary" :address-type="addressType" v-else/>
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
			:address-opt-out="addressOptOut"
			@set-address-type="setAddressType( $event )"
		/>

		<div class="donation-page-form-section">
			<FormSummary>
				<template #summary-content v-if="paymentSummary">
					<DonationSummary
						:address="addressSummary"
						:payment="paymentSummary"
						:bank-data="bankDataSummary"
						:countries="countries"
						:salutations="salutations"
						:hasAddressSummary="hasAddressSummary"
						:hasBankDataSummary="hasBankDataSummary"
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
						:payment-type="paymentSummary?.paymentType"
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
import type { TrackingData } from '@src/view_models/TrackingData';
import type { Country } from '@src/view_models/Country';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import PaymentSection from '@src/components/pages/donation_form/FormSections/PaymentSection.vue';
import PersonalDataSection from '@src/components/pages/donation_form/FormSections/PersonalDataSectionAnonymousChoice.vue';
import IbanFields from '@src/components/shared/IbanFields.vue';
import DonationSummary from '@src/components/pages/donation_form/DonationSummary.vue';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import ErrorSummary from '@src/components/pages/donation_form/ErrorSummary.vue';
import { default as OptOutErrorSummary } from '@src/components/pages/donation_form/AddressOptOut/ErrorSummary.vue';
import { useDonationFormSubmitHandler } from '@src/components/pages/donation_form/useDonationFormSubmitHandler';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressTypeFunctions } from '@src/components/shared/composables/useAddressTypeFunctions';
import { trackDynamicForm } from '@src/util/tracking';
import { useAddressOptOutModel } from '@src/components/pages/donation_form/AddressOptOut/useAddressOptOut';
import { useBankDataSummary } from '@src/components/pages/donation_form/useBankDataSummary';

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
const { hasAddressSummary, addressSummary } = useAddressSummary( store );
const { hasBankDataSummary, bankDataSummary } = useBankDataSummary( store );
const {
	disabledAddressTypes,
	addressType,
	addressTypeIsInvalid,
	setAddressType,
} = useAddressTypeFunctions( store );
const addressOptOut = useAddressOptOutModel( store );

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
