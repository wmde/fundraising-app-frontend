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

		<div class="form-input">
			<label for="title" class="subtitle">{{ $t( 'donation_form_academic_title_label' ) }}</label>
			<div class="field">
				<FunSelect
					class="is-form-input"
					v-model="formData.title.value"
					select-id="title"
					name="title"
					@update:modelValue="$emit('field-changed', 'title')"
				>
					<option value="">{{ $t( 'donation_form_academic_title_option_none' ) }}</option>
					<option value="Dr.">Dr.</option>
					<option value="Prof.">Prof.</option>
					<option value="Prof. Dr.">Prof. Dr.</option>
				</FunSelect>
			</div>
		</div>

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
import FunSelect from '@src/components/shared/legacy_form_inputs/FunSelect.vue';
import TextInput from '@src/components/shared/legacy_form_inputs/TextInput.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';

interface Props {
	salutations: Salutation[];
	formData: AddressFormData;
	showError: AddressValidity;
}

defineProps<Props>();
defineEmits( [ 'field-changed' ] );

</script>
