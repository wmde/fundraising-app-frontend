<template>
	<div class="address-section">
		<AutofillHandler @autofill="onAutofill">

			<NameFields
				:show-error="fieldErrors"
				:form-data="formData"
				:salutations="salutations"
				@field-changed="onFieldChange"
				:address-type="addressTypeFromStore"/>

			<PostalAddressFields
				:show-error="fieldErrors"
				:post-code-validation="addressValidationPatterns.postcode"
				:form-data="formData"
				:countries="countries"
				:country-was-restored="countryWasRestored"
				@field-changed="onFieldChange"
			/>

			<div class="form-field form-field-membership-receipt">
				<CheckboxSingleFormInput
					input-id="receipt-option-person"
					name="receipt-option"
					v-model="receiptNeeded"
				>
					{{ $t( 'receipt_needed_membership_page' ) }}
				</CheckboxSingleFormInput>
			</div>

			<IncentivesField
				:incentive-form-field-options="incentivesAsOptions"
				v-model="incentivesModel"
				@field-changed="onFieldChange"
			/>

			<TextField
				v-if="isPerson"
				name="date"
				input-id="date"
				:label="$t( 'membership_form_birth_date_label' )"
				v-model="formData.date.value"
				:placeholder="$t( 'membership_form_birth_date_placeholder' )"
				:show-error="fieldErrors.date"
				:error-message="$t( 'membership_form_birth_date_error' )"
				@field-changed="onFieldChange"
			>
				<template #message v-if="!fieldErrors.date">
					{{ $t( 'membership_form_birth_date_help_text' ) }}
				</template>
			</TextField>

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
		</AutofillHandler>
	</div>
</template>

<script setup lang="ts">
import type { Salutation } from '@src/view_models/Salutation';
import type { AddressValidation } from '@src/view_models/Validation';
import { Validity } from '@src/view_models/Validity';
import { computed, onBeforeMount, ref, toRefs } from 'vue';
import type { Country } from '@src/view_models/Country';
import PostalAddressFields from '@src/components/shared/PostalAddressFields.vue';
import NameFields from '@src/components/shared/NameFields.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import IncentivesField from '@src/components/shared/form_fields/IncentivesField.vue';
import { useAddressFunctions } from '@src/components/pages/membership_form/AddressFunctions';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import CheckboxSingleFormInput from '@src/components/shared/form_elements/CheckboxSingleFormInput.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { useReceiptModel } from '@src/components/pages/membership_form/useReceiptModel';
import { useIncentivesModel } from '@src/components/pages/membership_form/useIncentivesModel';
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import { useI18n } from 'vue-i18n';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { useStore } from 'vuex';

interface Props {
	validateAddressUrl: string;
	validateEmailUrl: string;
	countries: Country[];
	salutations: Salutation[];
	addressValidationPatterns: AddressValidation;
	dateOfBirthValidationPattern: String;
}
const props = defineProps<Props>();
const store = useStore();
const { t } = useI18n();

const { addressValidationPatterns } = toRefs( props );
const countryWasRestored = ref<boolean>( false );
const { receiptNeeded } = useReceiptModel( store, true );

const incentivesModel = useIncentivesModel( store );

const {
	formData,
	fieldErrors,

	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( {
	addressValidationPatterns: addressValidationPatterns.value,
	dateOfBirthValidationPattern: props.dateOfBirthValidationPattern.toString(),
}, store );

const incentivesAsOptions: CheckboxFormOption[] = [
	{ value: 'tote_bag', label: t( 'membership_form_incentive' ), id: 'tote_bag' },
];

const addressTypeFromStore = computed( (): AddressTypeModel => {
	return store.state.membership_address.addressType;
} );

const isPerson = computed( (): boolean => {
	return store.getters[ 'membership_address/isPerson' ];
} );

onBeforeMount( () => {
	countryWasRestored.value = store.state.membership_address.validity.country === Validity.RESTORED;
	initializeDataFromStore();
} );

</script>
