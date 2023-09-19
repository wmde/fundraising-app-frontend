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

		<form @submit="submit" action="/donation/add" method="post">
			<AutofillHandler @autofill="onAutofill">

				<PaymentBankData
					v-if="isDirectDebit"
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
					@field-changed="onFieldChange"
					:show-error="showReceiptOptionError"
					:error-message="$t( 'C23_WMDE_Desktop_DE_05_receipt_error' )"
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

			<div class="summary-wrapper has-margin-top-18 has-outside-border">
				<DonationSummary
					:payment="paymentSummary"
					:address-type="addressTypeName"
					:address="addressSummary"
					:countries="countries"
					:salutations="salutations"
					:language-item="inlineSummaryLanguageItem"
				/>

				<div class="columns payment-buttons">
					<div class="column">
						<FunButton
							id="previous-btn"
							class="level-item is-primary is-main is-outlined"
							@click="previousPage"
						>
							{{ $t( 'donation_form_section_back' ) }}
						</FunButton>
					</div>
					<div class="column">
						<FunButton
							id="submit-btn"
							:class="[ 'level-item is-primary is-main', { 'is-loading' : store.getters.isValidating } ]"
							button-type="submit"
						>
							{{ $t( 'donation_form_finalize' ) }}
						</FunButton>
					</div>
				</div>
				<div class="summary-notice" v-if="isExternalPayment">
					{{ $t( 'donation_form_summary_external_payment' ) }}
				</div>
				<div class="summary-notice" v-if="isBankTransferPayment">
					{{ $t( 'donation_form_summary_bank_transfer_payment' ) }}
				</div>
			</div>

			<input type="hidden" name="addressType" :value="addressTypeName">
			<input type="hidden" name="paymentType" :value="paymentType">
			<input type="hidden" name="interval" :value="interval">
			<input type="hidden" name="amount" :value="amount">
			<input type="hidden" name="impCount" :value="trackingData.impressionCount">
			<input type="hidden" name="bImpCount" :value="trackingData.bannerImpressionCount">
			<input type="hidden" name="piwik_campaign" :value="campaignValues.campaign">
			<input type="hidden" name="piwik_kwd" :value="campaignValues.keyword">

		</form>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import DonationSummary from '@src/components/shared/DonationSummary.vue';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import PaymentSummary from '@src/components/pages/donation_form/PaymentSummary.vue';
import { AddressValidation } from '@src/view_models/Validation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { StoreKey } from '@src/store/donation_store';
import { TrackingData } from '@src/view_models/TrackingData';
import { trackDynamicForm } from '@src/tracking';
import { useAddressFormEventHandlers } from '@src/components/pages/donation_form/DonationReceipt/useAddressFormEventHandlers';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import NameFields from '@src/components/pages/donation_form/DonationReceipt/NameFields.vue';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import { useMailingListModel } from '@src/components/pages/donation_form/DonationReceipt/useMailingListModel';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { useReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import AddressFields from '@src/components/pages/donation_form/DonationReceipt/AddressFields.vue';
import { useAddressType } from '@src/components/pages/donation_form/DonationReceipt/useAddressType';
import { useStore } from 'vuex';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import { Validity } from '@src/view_models/Validity';
import { usePaymentValues } from '@src/components/pages/donation_form/DonationReceipt/usePaymentValues';
import { useAddressTypeFromReceiptSetter } from '@src/components/pages/donation_form/DonationReceipt/useAddressTypeFromReceiptSetter';
import { adjustSalutationLocaleIfNeeded } from '@src/components/shared/SalutationLocaleAdjuster';

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
const { amount, interval, paymentType } = usePaymentValues( store );
const mailingList = useMailingListModel( store );
const { receiptNeeded, showReceiptOptionError } = useReceiptModel( store );
const countryWasRestored = ref<boolean>( false );
const urlQuery = window.location.search;

const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: props.addressValidationPatterns }, store );

const {
	isBankTransferPayment,
	isDirectDebit,
	isExternalPayment,
	paymentSummary,
	paymentWasInitialized,
} = usePaymentFunctions( store );

const { submit, previousPage } = useAddressFormEventHandlers( store, emit, isDirectDebit, props.validateAddressUrl, props.validateEmailUrl );

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
