<template>
	<ContentCard aria-labelledby="donation-form-subheading donation-form-tagline">
		<template #heading>
			<h2 id="donation-form-subheading">2. {{ $t( 'compact_donation_form_name_heading' ) }}</h2>
		</template>

		<template #content>

			<p id="donation-form-tagline">{{ $t( 'compact_donation_form_name_blurb' ) }}</p>

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
			<h2>3. {{ $t( 'compact_donation_form_other_info_heading' ) }}</h2>
		</template>

		<template #content>

			<form class="flow compact" @submit.prevent>

				<div class="repel">
					<p>{{  $t( 'compact_donation_form_other_info_blurb' ) }}</p>
					<CheckboxToggle
						v-model="receiptModel.receiptNeeded"
						name="donation-receipt"
						input-id="donation-receipt"
					>
						{{ $t( 'donation_confirmation_cta_title_alt' ) }}
					</CheckboxToggle>
				</div>

				<AddressFields
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					:receipt-model="receiptModel"
					:address-type="addressType"
					:is-company="isCompany"
					@field-changed="onAddressFieldChange"
					@company-toggled="onToggleCompany"
				/>
			</form>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRef } from 'vue';
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
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import type { ReceiptModel } from '@src/components/pages/donation_form/DonationReceipt/useReceiptModel';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import CheckboxToggle from '@src/components/shared/form_elements/CheckboxToggle.vue';
import { useAddressTypeManager } from '@src/components/pages/donation_form/Compact/useAddressTypeManager';
import { action } from '@src/store/util';

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
const isCompany = ref<boolean>( props.addressType === AddressTypeModel.COMPANY_WITH_CONTACT );

const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: props.addressValidationPatterns }, store );

const { updateAddressType } = useAddressTypeManager(
	computed<boolean>( () => receiptModel.value.receiptNeeded ),
	isCompany,
	computed<AddressTypeModel>( () => props.addressType ),
	formData,
	store
);

const onToggleCompany = ( newValue: boolean ): void => {
	isCompany.value = newValue;
	updateAddressType();
};

const onAddressFieldChange = ( fieldName: string ): void => {
	updateAddressType();
	if ( fieldErrors.value[ fieldName ] ) {
		onFieldChange( fieldName );
	} else if ( props.addressType !== AddressTypeModel.EMAIL ) {
		store.dispatch( action( 'address', 'setAndValidateAddressField' ), formData[ fieldName ] );
	}
};

onBeforeMount( initializeDataFromStore );

</script>
