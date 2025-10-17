<template>
	<ContentCard aria-labelledby="donation-form-subheading donation-form-tagline">
		<template #heading>
			<h2 id="donation-form-subheading">2. {{ $t( 'donation_form_address_subheading' ) }}</h2>
			<p id="donation-form-tagline">{{ $t( 'donation_form_section_address_tagline' ) }}</p>
		</template>

		<template #content>
			<form class="compact" id="donation-form" action="/donation/add" method="post" @submit.prevent>
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
					/>
					<MailingListField v-model="mailingList" input-id="newsletter"/>

				</AutofillHandler>
			</form>
		</template>
	</ContentCard>

	<ContentCard aria-labelledby="donation-form-subheading donation-form-tagline">
		<template #heading>
			<h2>3. Other Information</h2>
		</template>

		<template #content>
			<form class="flow compact" @submit.prevent>

				<div class="repel">
					<p>{{ $t( 'donation_form_last_step' ) }}</p>
					<CheckboxToggle
						v-model="receiptModel.receiptNeeded"
						name="donation-receipt"
						input-id="donation-receipt"
					>
						{{ $t( 'donation_confirmation_cta_title_alt' ) }}
					</CheckboxToggle>
				</div>

				<AddressFields
					v-if="receiptModel.receiptNeeded"
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					@field-changed="onFieldChange"
				/>
			</form>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, toRef } from 'vue';
import AddressFields from '@src/components/pages/donation_form/Compact/AddressFields.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import NameFields from '@src/components/pages/donation_form/Compact/NameFields.vue';
import type { AddressValidation } from '@src/view_models/Validation';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import type { TrackingData } from '@src/view_models/TrackingData';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import { useAddressTypeFromReceiptSetter } from '@src/components/pages/donation_form/Compact/useAddressTypeFromReceiptSetter';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import type { ReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import CheckboxToggle from '@src/components/shared/form_elements/CheckboxToggle.vue';

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

useAddressTypeFromReceiptSetter( props.receiptModel.receiptNeeded, computed<AddressTypeModel>( () => props.addressType ), store );

onBeforeMount( initializeDataFromStore );

</script>
