<template>
	<div
		class="address-page"
		aria-live="assertive"
		aria-labelledby="donation-form-heading donation-form-subheading donation-form-tagline"
		tabindex="-1"
		ref="pageRef"
	>
		<h1 id="donation-form-heading" class="form-title">{{ $t( 'donation_form_heading' ) }}</h1>
		<p id="donation-form-tagline">{{ $t( 'donation_form_section_address_tagline' ) }}</p>

		<PaymentSummary
			v-if="paymentWasInitialized"
			:amount="paymentSummary.amount"
			:payment-type="paymentSummary.paymentType"
			:interval="paymentSummary.interval"
			@previous-page="previousPage">
		</PaymentSummary>

		<form v-if="isDirectDebitPayment" id="bank-data-details" @submit="evt => evt.preventDefault()">
			<h2 v-if="isDirectDebitPayment" id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_payment_bankdata_title' ) }}</h2>
			<BankFields/>
		</form>

		<h2 v-if="isDirectDebitPayment" id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_address_subheading' ) }}</h2>

		<form @submit.prevent="submit" id="donation-form" action="/donation/add" method="post">
			<AutofillHandler @autofill="onAutofill">

				<NameFields
					:show-error="fieldErrors"
					:form-data="formData"
					:salutations="salutations"
					@field-changed="onFieldChange"
				/>

				<ScrollTarget target-id="email-scroll-target"/>
				<EmailField
					:show-error="fieldErrors.email"
					v-model="formData.email.value"
					@field-changed="onFieldChange"
				>
					<template #message>
						<ValueEqualsPlaceholderWarning
							:value="formData.email.value"
							:placeholder="$t( 'donation_form_email_placeholder' )"
							warning="donation_form_email_placeholder_warning"
						/>
					</template>
				</EmailField>

				<MailingListField v-model="mailingList" input-id="newsletter"/>

				<ScrollTarget target-id="receipt-scroll-target"/>
				<RadioField
					v-model="receiptNeeded"
					name="donationReceipt"
					:options="[
						{ value: true, label: $t( 'yes' ), id: 'donationReceipt-0' },
						{ value: false, label: $t( 'no' ), id: 'donationReceipt-1' },
					]"
					:label="$t( 'donation_confirmation_cta_title_alt' )"
					:show-error="showReceiptOptionError"
					:error-message="$t( 'C24_WMDE_Desktop_DE_01_receipt_error' )"
					alignment="row"
					aria-describedby="donation-receipt-help-text"
				>
					<template #intro-message>
						<div class="form-field-intro" id="donation-receipt-help-text">
							{{ $t( 'C24_WMDE_Desktop_DE_01_help_text' ) }}
						</div>
					</template>
				</RadioField>

				<FeatureToggle default-template="campaigns.address_field_order.legacy">
					<template #campaigns.address_field_order.legacy>
						<AddressFields
							v-if="receiptNeeded"
							:show-error="fieldErrors"
							:form-data="formData"
							:countries="countries"
							:post-code-validation="addressValidationPatterns.postcode"
							:country-was-restored="countryWasRestored"
							@field-changed="onFieldChange"
						/>
						<AddressFormErrorSummaries
							:show-error-summary="showErrorSummary"
							:address-type="addressType"
							:show-receipt-option-error="showReceiptOptionError"
							:receipt-needed="receiptNeeded"
						/>
					</template>

					<template #campaigns.address_field_order.new_order>
						<AddressFieldsStreetAutocomplete
							v-if="receiptNeeded"
							:show-error="fieldErrors"
							:form-data="formData"
							:countries="countries"
							:post-code-validation="addressValidationPatterns.postcode"
							:country-was-restored="countryWasRestored"
							@field-changed="onFieldChange"
						/>
						<AddressFormErrorSummariesStreetAutocomplete
							:show-error-summary="showErrorSummary"
							:address-type="addressType"
							:show-receipt-option-error="showReceiptOptionError"
							:receipt-needed="receiptNeeded"
						/>
					</template>
				</FeatureToggle>

			</AutofillHandler>

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
					/>
				</template>
			</FormSummary>
		</form>
		<form id="donation-form-submit-values" ref="submitValuesForm" action="/donation/add" method="post">
			<submit-values :tracking-data="trackingData" :campaign-values="campaignValues"></submit-values>
		</form>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import AddressFields from '@src/components/pages/donation_form/DonationReceipt/AddressFields.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import DonationSummary from '@src/components/pages/donation_form/DonationSummary.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import NameFields from '@src/components/pages/donation_form/DonationReceipt/NameFields.vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import { AddressValidation } from '@src/view_models/Validation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { Validity } from '@src/view_models/Validity';
import { adjustSalutationLocaleIfNeeded } from '@src/components/shared/SalutationLocaleAdjuster';
import { trackDynamicForm } from '@src/util/tracking';
import { useAddressFormEventHandlers } from '@src/components/pages/donation_form/DonationReceipt/useAddressFormEventHandlers';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressType } from '@src/components/pages/donation_form/DonationReceipt/useAddressType';
import { useAddressTypeFromReceiptSetter } from '@src/components/pages/donation_form/DonationReceipt/useAddressTypeFromReceiptSetter';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { useReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { useStore } from 'vuex';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import AddressFormErrorSummaries from '@src/components/pages/donation_form/DonationReceipt/AddressFormErrorSummaries.vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import BankFields from '@src/components/shared/BankFields.vue';
import AddressFieldsStreetAutocomplete
	from '@src/components/pages/donation_form/DonationReceipt/AddressFieldsStreetAutocomplete.vue';
import AddressFormErrorSummariesStreetAutocomplete
	from '@src/components/pages/donation_form/DonationReceipt/AddressFormErrorSummariesStreetAutocomplete.vue';

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
const store = useStore();

const { addressType, addressTypeName } = useAddressType( store );
const { addressSummary, inlineSummaryLanguageItem } = useAddressSummary( store );
const mailingList = useMailingListModel( store );
const { receiptNeeded, showReceiptOptionError } = useReceiptModel( store );
const countryWasRestored = ref<boolean>( false );
const pageRef = ref<HTMLElement>( null );
defineExpose( { focus: (): void => pageRef.value.focus() } );

const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: props.addressValidationPatterns }, store );

const {
	isDirectDebitPayment,
	paymentSummary,
	paymentWasInitialized,
} = usePaymentFunctions( store );

const { submit, previousPage, submitValuesForm, showErrorSummary } = useAddressFormEventHandlers(
	store,
	emit,
	isDirectDebitPayment,
	props.validateAddressUrl,
	props.validateEmailUrl,
	receiptNeeded
);

useAddressTypeFromReceiptSetter( receiptNeeded, addressType, store );

onBeforeMount( () => {
	countryWasRestored.value = store.state.address.validity.country === Validity.RESTORED;
	initializeDataFromStore();
} );

onMounted( () => {
	trackDynamicForm();

	// TODO: This should probably be initialised elsewhere maybe in the entry point?
	const translatedSalutation = adjustSalutationLocaleIfNeeded( props.salutations, formData.salutation.value );
	if ( translatedSalutation !== '' ) {
		formData.salutation.value = translatedSalutation;
		onFieldChange( 'salutation' );
	}
} );

</script>
