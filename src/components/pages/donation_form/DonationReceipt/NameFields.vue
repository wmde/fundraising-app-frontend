<template>
	<div class="name-section">

		<RadioField
			name="salutationInternal"
			v-model="formData.salutation.value"
			:label="$t( 'donation_form_salutation_label' )"
			:options="salutations"
			:show-error="showError.salutation"
			:error-message="$t( 'donation_form_salutation_error' )"
			@field-changed="$emit('field-changed', 'salutation')"
		/>

		<SelectField
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

		<div v-bind:class="['form-input', { 'is-invalid': showError.firstName }]">
			<label for="first-name" class="subtitle">{{ $t( 'donation_form_firstname_label' ) }}</label>
			<div class="field">
				<TextInput
					class="is-medium"
					input-id="first-name"
					v-model="formData.firstName.value"
					:has-error="showError.firstName"
					:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_firstname_placeholder' ) } )"
					autocomplete="given-name"
					@blur="$emit('field-changed', 'firstName')"
				/>
			</div>
			<span v-if="showError.firstName" class="help is-danger error-first-name">{{ $t( 'donation_form_firstname_error' ) }}</span>
		</div>

		<div v-bind:class="['form-input', { 'is-invalid': showError.lastName }]">
			<label for="last-name" class="subtitle">{{ $t( 'donation_form_lastname_label' ) }}</label>
			<div class="field">
				<TextInput
					input-id="last-name"
					v-model="formData.lastName.value"
					:has-error="showError.lastName"
					:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_lastname_placeholder' ) } )"
					autocomplete="family-name"
					@blur="$emit('field-changed', 'lastName')"
				/>
			</div>
			<span v-if="showError.lastName" class="help is-danger error-last-name">{{ $t( 'donation_form_lastname_error' ) }}</span>
			<ValueEqualsPlaceholderWarning
				:value="formData.lastName.value"
				:placeholder="$t( 'donation_form_lastname_placeholder_check' )"
				:warning="'donation_form_lastname_placeholder_warning'"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">

import { Salutation } from '@src/view_models/Salutation';
import { AddressFormData, AddressValidity } from '@src/view_models/Address';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import TextInput from '@src/components/shared/legacy_form_inputs/TextInput.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import SelectField from '@src/components/shared/form_fields/SelectField.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';

interface Props {
	salutations: Salutation[];
	formData: AddressFormData;
	showError: AddressValidity;
}

defineProps<Props>();
defineEmits( [ 'field-changed' ] );

</script>
