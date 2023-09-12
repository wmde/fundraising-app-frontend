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

		<form v-if="isDirectDebit" id="bank-data-details" @submit="evt => evt.preventDefault()">
			<PaymentBankData
				:validateBankDataUrl="validateBankDataUrl"
				:validateLegacyBankDataUrl="validateLegacyBankDataUrl"
			/>
		</form>

		<NameFields
			:show-error="fieldErrors"
			:form-data="formData"
			:salutations="salutations"
		/>

		<EmailField
			:show-error="fieldErrors.email"
			v-model="formData.email.value"
		>
			<template #message>
				<ValueEqualsPlaceholderWarning
					:value="formData.email.value"
					:placeholder="$t( 'donation_form_email_placeholder' )"
					warning="donation_form_email_placeholder_warning"
				/>
			</template>
		</EmailField>

		<MailingListField v-model="mailingList"/>

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
						:class="[ 'level-item is-primary is-main', { 'is-loading' : $store.getters.isValidating } ]"
						@click="submit">
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
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
import { injectStrict } from '@src/util/injectStrict';
import { trackDynamicForm } from '@src/tracking';
import { useAddressFormEventHandlers } from '@src/components/pages/donation_form/useAddressFormEventHandlers';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useAddressTypeFunctions } from '@src/components/pages/donation_form/AddressTypeFunctions';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import NameFields from '@src/components/pages/donation_form/DonationReceipt/NameFields.vue';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import { useMailHostList } from '@src/components/shared/useMailHostList';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setNewsletterChoice } from '@src/store/address/actionTypes';
import { useMailingListModel } from '@src/components/pages/donation_form/useMailingListModel';

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

const store = injectStrict( StoreKey );

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
	formData,
	fieldErrors,
	receiptNeeded,

	initializeDataFromStore,
	onFieldChange,
	onAutofill,
	setReceipt,
} = useAddressFunctions( { addressValidationPatterns: props.addressValidationPatterns }, store );

const {
	isBankTransferPayment,
	isDirectDebit,
	isExternalPayment,
	paymentSummary,
	paymentWasInitialized,
} = usePaymentFunctions( store );

const {
	addressSummary,
	inlineSummaryLanguageItem,
} = useAddressSummary( store );

const mailingList = useMailingListModel( store );

const { submit, previousPage } = useAddressFormEventHandlers( store, emit, addressType, isDirectDebit, props.validateAddressUrl, props.validateEmailUrl );

</script>
