<template>
	<div class="name-section">

		<RadioField
			v-if="showPersonalFields"
			name="salutation"
			v-model="formData.salutation.value"
			:label="$t( 'donation_form_salutation_label' )"
			:options="salutations"
			:show-error="showError.salutation"
			:error-message="$t( 'donation_form_salutation_error' )"
			@field-changed="$emit('field-changed', 'salutation')"
			alignment="column"
		/>

		<SelectField
			v-if="showPersonalFields"
			name="title"
			v-model="formData.title.value"
			:label="$t( 'donation_form_academic_title_label' )"
			:options="[
				{ label: $t( 'donation_form_academic_title_option_none' ), value: '' },
				{ label: 'Dr.', value: 'Dr.' },
				{ label: 'Prof.', value: 'Prof.' },
				{ label: 'Prof. Dr.', value: 'Prof. Dr.' },
			]"
			@field-changed="$emit('field-changed', 'title')"
		/>

		<TextField
			v-if="showPersonalFields"
			name="firstName"
			input-id="first-name"
			v-model="formData.firstName.value"
			:show-error="showError.firstName"
			:error-message="$t( 'donation_form_firstname_error' )"
			autocomplete="given-name"
			:label="$t( 'donation_form_firstname_label' )"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_firstname_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'firstName')"
		/>

		<TextField
			v-if="showPersonalFields"
			name="lastName"
			input-id="last-name"
			v-model="formData.lastName.value"
			:show-error="showError.lastName"
			:error-message="$t( 'donation_form_lastname_error' )"
			autocomplete="family-name"
			:label="$t( 'donation_form_lastname_label' )"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_lastname_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'lastName')"
		>
			<template #message>
				<ValueEqualsPlaceholderWarning
					:value="formData.lastName.value"
					:placeholder="$t( 'donation_form_lastname_placeholder_check' )"
					:warning="'donation_form_lastname_placeholder_warning'"
				/>
			</template>
		</TextField>

		<TextField
			v-if="showCompanyFields"
			name="companyName"
			input-id="company-name"
			v-model="formData.companyName.value"
			:show-error="showError.companyName"
			:error-message="$t( 'donation_form_companyname_error' )"
			autocomplete="organization"
			:label="$t( 'donation_form_companyname_label' )"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_companyname_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'companyName')"
		/>
	</div>
</template>

<script setup lang="ts">

import { Salutation } from '@src/view_models/Salutation';
import { AddressFormData, AddressValidity } from '@src/view_models/Address';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import SelectField from '@src/components/shared/form_fields/SelectField.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed } from 'vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';

interface Props {
	addressType: AddressTypeModel
	salutations: Salutation[];
	formData: AddressFormData;
	showError: AddressValidity;
}

const props = defineProps<Props>();
defineEmits( [ 'field-changed' ] );

const showPersonalFields = computed( () =>
	[
		AddressTypeModel.PERSON,
		AddressTypeModel.EMAIL,
		AddressTypeModel.UNSET,
	].includes( props.addressType )
);
const showCompanyFields = computed( () => props.addressType === AddressTypeModel.COMPANY );

</script>
