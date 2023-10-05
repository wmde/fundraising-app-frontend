<template>
	<div class="address-page">
		<h1 v-if="!paymentWasInitialized" class="title is-size-1">{{ $t( 'donation_form_section_headline' ) }}</h1>

		<PaymentSummary
			v-if="paymentWasInitialized"
			:amount="paymentSummary.amount"
			:payment-type="paymentSummary.paymentType"
			:interval="paymentSummary.interval"
			@previous-page="previousPage">
		</PaymentSummary>

		<form @submit.prevent="submit" action="/donation/add" method="post">
			<AutofillHandler @autofill="onAutofill">

				<PaymentBankData
					v-if="isDirectDebitPayment"
					:validateBankDataUrl="validateBankDataUrl"
					:validateLegacyBankDataUrl="validateLegacyBankDataUrl"
				/>

				<NameFields
					:show-error="fieldErrors"
					:form-data="formData"
					:salutations="salutations"
					@field-changed="onFieldChange"
				/>

				<EmailField
					:show-error="fieldErrors.email"
					v-model="formData.email.value"
					@field-changed="onFieldChange"
				>
					<template #message>
						<ValueEqualsPlaceholderWarning
							:value="formData.email.value"
							:placeholder="$t( 'donation_form_email_placeholder_vuei18n_v3' )"
							warning="donation_form_email_placeholder_warning"
						/>
					</template>
				</EmailField>

				<MailingListField v-model="mailingList"/>

				<RadioField
					v-model="receiptNeeded"
					name="donationReceipt"
					:options="[
						{ value: true, label: $t( 'yes' ) },
						{ value: false, label: $t( 'no' ) },
					]"
					:label="$t( 'donation_confirmation_cta_title_alt' )"
					:show-error="showReceiptOptionError"
					:error-message="$t( 'C23_WMDE_Desktop_DE_05_receipt_error' )"
					alignment="row"
				/>

				<AddressFields
					v-if="receiptNeeded"
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					:country-was-restored="countryWasRestored"
					@field-changed="onFieldChange"
				/>

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
						:is-loading="$store.getters.isValidating"
						:payment-type="paymentSummary.paymentType"
						@click="submit"
					/>
				</template>

				<template #summary-notice>
					<div class="form-summary-notice" v-if="isExternalPayment">
						{{ $t( 'donation_form_summary_external_payment' ) }}
					</div>
					<div class="form-summary-notice" v-if="isBankTransferPayment">
						{{ $t( 'donation_form_summary_bank_transfer_payment' ) }}
					</div>
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
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import { AddressValidation } from '@src/view_models/Validation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { StoreKey } from '@src/store/donation_store';
import { TrackingData } from '@src/view_models/TrackingData';
import { Validity } from '@src/view_models/Validity';
import { adjustSalutationLocaleIfNeeded } from '@src/components/shared/SalutationLocaleAdjuster';
import { trackDynamicForm } from '@src/util/tracking';
import { useAddressFormEventHandlers } from '@src/components/pages/donation_form/DonationReceipt/useAddressFormEventHandlers';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressType } from '@src/components/pages/donation_form/DonationReceipt/useAddressType';
import { useAddressTypeFromReceiptSetter } from '@src/components/pages/donation_form/DonationReceipt/useAddressTypeFromReceiptSetter';
import { useMailingListModel } from '@src/components/pages/donation_form/DonationReceipt/useMailingListModel';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import { useReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { useStore } from 'vuex';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';

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
const store = useStore( StoreKey );

const { addressType, addressTypeName } = useAddressType( store );
const { addressSummary, inlineSummaryLanguageItem } = useAddressSummary( store );
const mailingList = useMailingListModel( store );
const { receiptNeeded, showReceiptOptionError } = useReceiptModel( store );
const countryWasRestored = ref<boolean>( false );

const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: props.addressValidationPatterns }, store );

const {
	isBankTransferPayment,
	isDirectDebitPayment,
	isExternalPayment,
	paymentSummary,
	paymentWasInitialized,
} = usePaymentFunctions( store );

const { submit, previousPage, submitValuesForm } =
	useAddressFormEventHandlers( store, emit, isDirectDebitPayment, props.validateAddressUrl, props.validateEmailUrl );

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
