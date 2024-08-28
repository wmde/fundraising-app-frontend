<template>
	<div
		id="single-page-form-section-personal-data-donation-receipt"
		class="single-page-form-section"
	>

		<h2 id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_address_subheading' ) }}</h2>
		<p id="donation-form-tagline">{{ $t( 'donation_form_section_address_tagline' ) }}</p>

		<form @submit.prevent="submit" id="donation-form" action="/donation/add" method="post">
			<AutofillHandler @autofill="onAutofill">
				<ScrollTarget target-id="iban-scroll-target"/>
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

			<SinglePageErrorSummary
				:show-error-summary="showErrorSummary"
				:address-type="addressType"
				:show-receipt-option-error="showReceiptOptionError"
			/>

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
						@click="scrollToPaymentSection()"
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

import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import DonationSummary from '@src/components/pages/donation_form/DonationSummary.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import NameFields from '@src/components/pages/donation_form/DonationReceipt/NameFields.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import AddressFields from '@src/components/pages/donation_form/DonationReceipt/AddressFields.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import PaymentTextFormButton from '@src/components/shared/form_elements/PaymentTextFormButton.vue';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressValidation } from '@src/view_models/Validation';
import { useStore } from 'vuex';
import { StoreKey } from '@src/store/donation_store';
import { useAddressType } from '@src/components/pages/donation_form/DonationReceipt/useAddressType';
import { useAddressSummary } from '@src/components/pages/donation_form/useAddressSummary';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import { useReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import { usePaymentFunctions } from '@src/components/pages/donation_form/usePaymentFunctions';
import {
	usePersonalDataSectionEventHandlers,
} from '@src/components/pages/donation_form/usePersonalDataSectionEventHandlers';
import {
	useAddressTypeFromReceiptSetter,
} from '@src/components/pages/donation_form/DonationReceipt/useAddressTypeFromReceiptSetter';
import { Validity } from '@src/view_models/Validity';
import { trackDynamicForm } from '@src/util/tracking';
import { adjustSalutationLocaleIfNeeded } from '@src/components/shared/SalutationLocaleAdjuster';
import SinglePageErrorSummary from '@src/components/pages/donation_form/singlePageFromSections/SinglePageErrorSummary.vue';

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
const store = useStore( StoreKey );

const { addressType, addressTypeName } = useAddressType( store );
const { addressSummary, inlineSummaryLanguageItem } = useAddressSummary( store );
const mailingList = useMailingListModel( store );
const { receiptNeeded, showReceiptOptionError } = useReceiptModel( store );
const countryWasRestored = ref<boolean>( false );

const scrollToPaymentSection = () => {
	const scrollIntoViewElement = document.getElementById( 'single-page-form-section-payment' );
	if ( scrollIntoViewElement ) {
		scrollIntoViewElement.scrollIntoView( { behavior: 'smooth' } );
	}
};

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
} = usePaymentFunctions( store );

const { submit, submitValuesForm, showErrorSummary } = usePersonalDataSectionEventHandlers(
	store,
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
	// TODO tracking: needs simple form tracking
	trackDynamicForm();

	// TODO: This should probably be initialised elsewhere maybe in the entry point?
	const translatedSalutation = adjustSalutationLocaleIfNeeded( props.salutations, formData.salutation.value );
	if ( translatedSalutation !== '' ) {
		formData.salutation.value = translatedSalutation;
		onFieldChange( 'salutation' );
	}
} );

</script>
