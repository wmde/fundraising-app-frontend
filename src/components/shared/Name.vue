<template>
<div class="name-section">
	<div v-if="showPersonalFields">
		<fieldset class="form-input form-input__horizontal-option-list">
			<legend class="subtitle">{{ $t( 'donation_form_salutation_label' ) }}</legend>
			<div class="radio-container">
				<RadioInput
					v-for="salutation in salutations"
					:key="salutation.value"
					:class="{ 'is-active': formData.salutation.value === salutation.label }"
					:id="`salutation-${salutation.value}`"
					name="salutationInternal"
					:native-value="salutation.label"
					v-model="formData.salutation.value"
					@update:modelValue="$emit('field-changed', 'salutation')"
				>
					{{ salutation.label }}
				</RadioInput>
			</div>
			<span v-if="showError.salutation" class="help is-danger error-salutation"> {{ $t( 'donation_form_salutation_error' ) }}</span>
		</fieldset>
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
	<div v-if="showCompanyFields" v-bind:class="['form-input', { 'is-invalid': showError.companyName }]">
		<label for="company-name" class="subtitle">{{ $t( 'donation_form_companyname_label' ) }}</label>
		<div class="field">
			<TextInput
				input-id="company-name"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_companyname_placeholder' ) } )"
				autocomplete="organization"
				v-model="formData.companyName.value"
				:has-error="showError.companyName"
				@blur="$emit('field-changed', 'companyName')"
			/>
		</div>
		<span v-if="showError.companyName" class="help is-danger  error-company-name">{{ $t( 'donation_form_companyname_error' )  }}</span>
	</div>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AddressFormData, AddressValidity } from '@src/view_models/Address';
import { Salutation } from '@src/view_models/Salutation';
import { adjustSalutationLocaleIfNeeded } from '@src/components/shared/SalutationLocaleAdjuster';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import RadioInput from '@src/components/shared/legacy_form_inputs/RadioInput.vue';
import TextInput from '@src/components/shared/legacy_form_inputs/TextInput.vue';
import FunSelect from '@src/components/shared/legacy_form_inputs/FunSelect.vue';

export default defineComponent( {
	name: 'name',
	components: { FunSelect, TextInput, RadioInput, ValueEqualsPlaceholderWarning },
	props: {
		showError: Object as () => AddressValidity,
		formData: Object as () => AddressFormData,
		addressType: Number as () => AddressTypeModel,
		salutations: Array as () => Array<Salutation>,
	},
	setup( props, context ) {
		onMounted( () => {
			const translatedSalutation = adjustSalutationLocaleIfNeeded( props.salutations, props.formData.salutation.value );
			if ( translatedSalutation !== '' ) {
				props.formData.salutation.value = translatedSalutation;
				context.emit( 'field-changed', 'salutation' );
			}
		} );

		const showPersonalFields = computed( () => props.addressType === AddressTypeModel.PERSON ||
				props.addressType === AddressTypeModel.EMAIL ||
				props.addressType === AddressTypeModel.UNSET );
		const showCompanyFields = computed( () => props.addressType === AddressTypeModel.COMPANY );

		return {
			showCompanyFields,
			showPersonalFields,
		};
	},
} );
</script>
