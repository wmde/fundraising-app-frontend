<template>
	<div class="address-page">
		<PaymentSummary
			v-if="paymentWasInitialized"
			:amount="paymentSummary.amount"
			:payment-type="paymentSummary.paymentType"
			:interval="paymentSummary.interval"
			@previous-page="previousPage">
		</PaymentSummary>

		<form v-if="isDirectDebitPayment" id="bank-data-details" @submit="evt => evt.preventDefault()">
			<PaymentBankData
				:validateBankDataUrl="validateBankDataUrl"
				:validateLegacyBankDataUrl="validateLegacyBankDataUrl"
			/>
		</form>

		<form id="address-type-selection" @submit="evt => evt.preventDefault()">
			<AddressTypeBasic
				@address-type="setAddressType( $event )"
				@set-full-selected="setFullSelected"
				:disabledAddressTypes="disabledAddressTypes"
				:is-direct-debit="isDirectDebitPayment"
				:initial-address-type="addressType"
				:address-type-is-invalid="addressTypeIsInvalid"
			/>
			<div
				class="address-type-anonymous-disclaimer"
				v-show="!addressTypeIsNotAnon">{{ $t( 'donation_addresstype_option_anonymous_disclaimer' ) }}
			</div>
		</form>

		<AddressForms
			:countries="countries"
			:salutations="salutations"
			:address-validation-patterns="addressValidationPatterns"
			:is-full-selected="isFullSelected"
			:address-type="addressType"
			:tracking-data="trackingData"
			:campaign-values="campaignValues">
		</AddressForms>

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
						@click="previousPage"
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
		<form :action="`/donation/add?${campaignParams}`" method="post" ref="submitValuesForm">
			<submit-values :tracking-data="trackingData" :campaign-values="campaignValues"></submit-values>
		</form>
	</div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import AddressForms from '@src/components/pages/donation_form/AddressForms.vue';
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import DonationSummary from '@src/components/pages/donation_form/DonationSummary.vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import { AddressValidation } from '@src/view_models/Validation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { trackDynamicForm } from '@src/util/tracking';
import { useAddressFormEventHandlers } from '@src/components/pages/donation_form/useAddressFormEventHandlers';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressTypeFunctions } from '@src/components/pages/donation_form/AddressTypeFunctions';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { useStore } from 'vuex';

interface Props {
	assetsPath: string;
	validateAddressUrl: string;
	validateEmailUrl: string;
	validateBankDataUrl: string;
	validateLegacyBankDataUrl: string;
	countries: Country[];
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
	addressValidationPatterns: AddressValidation;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'previous-page' ] );

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );
const isFullSelected = ref( false );
const store = useStore();

const setFullSelected = ( selected: boolean ) => {
	isFullSelected.value = selected;
};

onMounted( trackDynamicForm );

const {
	disabledAddressTypes,
	addressType,
	addressTypeIsNotAnon,
	addressTypeIsInvalid,
	addressTypeName,
	setAddressType,
} = useAddressTypeFunctions( store );

const {
	isDirectDebitPayment,
	paymentSummary,
	paymentWasInitialized,
} = usePaymentFunctions( store );

const {
	addressSummary,
	inlineSummaryLanguageItem,
} = useAddressSummary( store );

const { submit, previousPage, submitValuesForm } = useAddressFormEventHandlers(
	store,
	emit,
	addressType,
	isDirectDebitPayment,
	props.validateAddressUrl,
	props.validateEmailUrl
);

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use 'sass:map';

.address-type-anonymous-disclaimer {
	margin-top: map.get( units.$spacing, 'medium' );
}
</style>
