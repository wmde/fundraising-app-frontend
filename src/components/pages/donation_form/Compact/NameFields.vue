<template>

	<div class="flex-field-group">
		<SelectField
			name="title"
			v-model="formData.title.value"
			id="address-form-title"
			input-id="title"
			:label="$t( 'donation_form_academic_title_label' )"
			:options="[
				{ label: $t( 'donation_form_academic_title_option_none' ), value: '' },
				{ label: 'Dr.', value: 'Dr.' },
				{ label: 'Prof.', value: 'Prof.' },
				{ label: 'Prof. Dr.', value: 'Prof. Dr.' },
			]"
			@field-changed="$emit('field-changed', 'title')"
		/>
		<RadioField
			name="salutation"
			id="address-form-salutation"
			v-model="formData.salutation.value"
			:label="$t( 'donation_form_salutation_label' )"
			:options="salutationFormOptions"
			:show-error="showError.salutation"
			:error-message="$t( 'donation_form_salutation_error' )"
			layoutType="cluster"
			@field-changed="$emit('field-changed', 'salutation')"
		/>
	</div>

	<div class="grid" data-layout="halves">
		<TextField
			name="firstName"
			id="address-form-first-name"
			input-id="first-name"
			v-model="formData.firstName.value"
			:show-error="showError.firstName"
			:error-message="$t( 'donation_form_firstname_error' )"
			autocomplete="given-name"
			:label="$t( 'donation_form_firstname_label' )"
			:placeholder="$t( 'donation_form_firstname_placeholder' )"
			@field-changed="$emit('field-changed', 'firstName')"
		/>
		<TextField
			name="lastName"
			id="address-form-last-name"
			input-id="last-name"
			v-model="formData.lastName.value"
			:show-error="showError.lastName"
			:error-message="$t( 'donation_form_lastname_error' )"
			autocomplete="family-name"
			:label="$t( 'donation_form_lastname_label' )"
			:placeholder="$t( 'donation_form_lastname_placeholder' )"
			placeholder-warning="donation_form_lastname_placeholder_warning"
			@field-changed="$emit('field-changed', 'lastName')"
		/>
	</div>

</template>

<script setup lang="ts">

import type { Salutation } from '@src/view_models/Salutation';
import type { AddressFormData, AddressValidity } from '@src/view_models/Address';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import SelectField from '@src/components/shared/form_fields/SelectField.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';

interface Props {
	salutations: Salutation[];
	formData: AddressFormData;
	showError: AddressValidity;
}

const props = defineProps<Props>();
defineEmits( [ 'field-changed' ] );

const salutationFormOptions: CheckboxFormOption[] = props.salutations.map( ( x, index ) => (
	{ value: x.value, label: x.label, id: `salutation-${ index }` }
) );

</script>
