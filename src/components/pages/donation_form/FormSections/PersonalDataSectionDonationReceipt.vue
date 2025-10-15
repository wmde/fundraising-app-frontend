<template>
	<ContentCard aria-labelledby="donation-form-subheading donation-form-tagline">
		<template #heading>
			<h2 id="donation-form-subheading">{{ $t( 'donation_form_address_subheading' ) }}</h2>
			<p id="donation-form-tagline">{{ $t( 'donation_form_section_address_tagline' ) }}</p>
		</template>

		<template #content>
			<form id="donation-form" class="flow" action="/donation/add" method="post">
				<AutofillHandler @autofill="onAutofill">

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
						data-max-width
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

					<RadioField
						id="address-form-receipt"
						v-model="receiptModel.receiptNeeded"
						name="donationReceipt"
						:options="[
							{ value: true, label: $t( 'yes' ), id: 'donationReceipt-0' },
							{ value: false, label: $t( 'no' ), id: 'donationReceipt-1' },
						]"
						:label="$t( 'donation_confirmation_cta_title_alt' )"
						:show-error="receiptModel.showReceiptOptionError"
						:error-message="$t( 'C24_WMDE_Desktop_DE_01_receipt_error' )"
						aria-describedby="donation-receipt-help-text"
						:layout-type="'cluster'"
					>
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
		</template>
	</ContentCard>
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
import type { AddressValidation } from '@src/view_models/Validation';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import type { TrackingData } from '@src/view_models/TrackingData';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import { useAddressTypeFromReceiptSetter } from '@src/components/pages/donation_form/DonationReceipt/useAddressTypeFromReceiptSetter';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import type { ReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import ContentCard from '@src/components/patterns/ContentCard.vue';

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
