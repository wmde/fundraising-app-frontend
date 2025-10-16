<template>
	<form
		name="laika-donation-personal-data-person"
		id="laika-donation-personal-data-person"
		class="address-type-form display-toggler"
		:class="{ 'display-toggler--visible': addressType === AddressTypeModel.PERSON || addressType === AddressTypeModel.UNSET }"
		action="/donation/add"
		method="post"
		@submit.prevent
	>
		<AutofillHandler @autofill="onAutofill">
			<NameFields
				:show-error="fieldErrors"
				:form-data="formData"
				:address-type="AddressTypeModel.PERSON"
				:salutations="salutations"
				field-id-namespace="person"
				v-on:field-changed="onFieldChange"
			/>
			<PostalAddressFields
				:show-error="fieldErrors"
				:form-data="formData"
				:countries="countries"
				:post-code-validation="addressValidationPatterns.postcode"
				:country-was-restored="countryWasRestored"
				field-id-namespace="person"
				v-on:field-changed="onFieldChange"
			/>

			<FieldContainer input-id="receipt-option-person" data-max-width>
				<template #field>
					<CheckboxSingleFormInput
						input-id="receipt-option-person"
						name="receipt-option"
						v-model="receiptNeeded"
					>
						{{ $t( 'receipt_needed_donation_page' ) }}
					</CheckboxSingleFormInput>
				</template>
			</FieldContainer>

			<EmailField
				:show-error="fieldErrors.email"
				v-model="formData.email.value"
				id="person-address-form-email"
				input-id="person-email"
				@field-changed="onFieldChange"
				data-max-width
			/>
			<MailingListField v-model="mailingList" input-id="person-newsletter" data-max-width/>
		</AutofillHandler>
	</form>

	<form
		name="laika-donation-personal-data-company"
		id="laika-donation-personal-data-company"
		class="address-type-form display-toggler"
		:class="{ 'display-toggler--visible': addressType === AddressTypeModel.COMPANY }"
		action="/donation/add"
		method="post"
		@submit.prevent
	>
		<AutofillHandler @autofill="onAutofill">
			<NameFields
				:show-error="fieldErrors"
				:form-data="formData"
				:address-type="AddressTypeModel.COMPANY"
				:salutations="salutations"
				field-id-namespace="company"
				v-on:field-changed="onFieldChange"
			/>
			<PostalAddressFields
				:show-error="fieldErrors"
				:form-data="formData"
				:countries="countries"
				:post-code-validation="addressValidationPatterns.postcode"
				:country-was-restored="countryWasRestored"
				field-id-namespace="company"
				v-on:field-changed="onFieldChange"
			/>

			<FieldContainer input-id="receipt-option-company" data-max-width>
				<template #field>
					<CheckboxSingleFormInput
						input-id="receipt-option-company"
						name="receipt-option"
						v-model="receiptNeeded"
					>
						{{ $t( 'receipt_needed_donation_page' ) }}
					</CheckboxSingleFormInput>
				</template>
			</FieldContainer>

			<EmailField
				:show-error="fieldErrors.email"
				v-model="formData.email.value"
				id="company-address-form-email"
				input-id="company-email"
				@field-changed="onFieldChange"
				data-max-width
			/>
			<MailingListField v-model="mailingList" input-id="company-newsletter" data-max-width/>
		</AutofillHandler>
	</form>

	<form
		name="laika-donation-personal-data-email"
		id="laika-donation-personal-data-email"
		class="address-type-form display-toggler"
		:class="{ 'display-toggler--visible': addressType === AddressTypeModel.EMAIL }"
		action="/donation/add"
		method="post"
		@submit.prevent
	>
		<AutofillHandler @autofill="onAutofill">
			<NameFields
				:show-error="fieldErrors"
				:form-data="formData"
				:address-type="AddressTypeModel.PERSON"
				:salutations="salutations"
				field-id-namespace="email"
				v-on:field-changed="onFieldChange"
			/>

			<EmailField
				:show-error="fieldErrors.email"
				v-model="formData.email.value"
				id="email-address-form-email"
				input-id="email-email"
				@field-changed="onFieldChange"
			/>
			<MailingListField v-model="mailingList" input-id="email-newsletter"/>
		</AutofillHandler>
	</form>

</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRefs } from 'vue';
import PostalAddressFields from '@src/components/pages/donation_form/PostalAddressFields.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import CheckboxSingleFormInput from '@src/components/shared/form_elements/CheckboxSingleFormInput.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import NameFields from '@src/components/shared/NameFields.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import type { Country } from '@src/view_models/Country';
import type { AddressValidation } from '@src/view_models/Validation';
import { useAddressFunctions } from './AddressFunctions';
import type { Salutation } from '@src/view_models/Salutation';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import { Validity } from '@src/view_models/Validity';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import { useStore } from 'vuex';
import { useReceiptModel } from '@src/components/shared/composables/useReceiptModel';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';

interface Props {
	countries: Country[];
	addressValidationPatterns: AddressValidation;
	addressType: AddressTypeModel;
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
}

const props = withDefaults( defineProps<Props>(), {
	addressType: AddressTypeModel.PERSON,
} );

const { addressType, addressValidationPatterns } = toRefs( props );
const store = useStore();
const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: addressValidationPatterns.value }, store );

const mailingList = useMailingListModel( store );

const { receiptNeeded } = useReceiptModel( store );

const countryWasRestored = ref<boolean>( false );

onBeforeMount( () => {
	countryWasRestored.value = store.state.address.validity.country === Validity.RESTORED;
	initializeDataFromStore();
} );
</script>
