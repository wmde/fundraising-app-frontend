<template>
	<div
		class="donation-page-form-section"
		id="donation-page-form-section-personal-data-donation-receipt"
		aria-labelledby="donation-form-subheading donation-form-tagline"
	>
		<h2 id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_address_subheading' ) }}</h2>
		<p id="donation-form-tagline">{{ $t( 'donation_form_section_address_tagline' ) }}</p>
		<form id="donation-form" action="/donation/add" method="post">
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
					v-model="receiptModel.receiptNeeded"
					name="donationReceipt"
					:options="[
						{ value: true, label: $t( 'yes' ), id: 'donationReceipt-0' },
						{ value: false, label: $t( 'no' ), id: 'donationReceipt-1' },
					]"
					:label="$t( 'donation_confirmation_cta_title_alt' )"
					:show-error="receiptModel.showReceiptOptionError"
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
					v-if="receiptModel.receiptNeeded"
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					@field-changed="onFieldChange"
				/>

			</AutofillHandler>
		</form>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, toRef } from 'vue';
import AddressFields from '@src/components/pages/donation_form/DonationReceipt/AddressFields.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import NameFields from '@src/components/pages/donation_form/DonationReceipt/NameFields.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import { AddressValidation } from '@src/view_models/Validation';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import { useAddressTypeFromReceiptSetter } from '@src/components/pages/donation_form/DonationReceipt/useAddressTypeFromReceiptSetter';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import { ReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { useStore } from 'vuex';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

interface Props {
	countries: Country[];
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
	addressValidationPatterns: AddressValidation;
	isDirectDebitPayment: boolean;
	disabledAddressTypes: AddressTypeModel[];
	addressType: AddressTypeModel;
	receiptModel: ReceiptModel;
	addressTypeIsInvalid: boolean;
}

const props = defineProps<Props>();
const store = useStore();

const mailingList = useMailingListModel( store );
const receiptModel = toRef<ReceiptModel>( props.receiptModel );

const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: props.addressValidationPatterns }, store );

useAddressTypeFromReceiptSetter( props.receiptModel.receiptNeeded, toRef( props.addressType ), store );

onBeforeMount( initializeDataFromStore );

</script>
