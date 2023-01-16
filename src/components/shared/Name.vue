<template>
<div class="name-section">
	<div v-if="showPersonalFields">
		<fieldset class="form-input form-input__horizontal-option-list">
			<legend class="subtitle">{{ $t( 'donation_form_salutation_label' ) }}</legend>
			<div class="radio-container">
				<b-radio v-for="salutation in salutations" :key="salutation.value"
						:id="`salutation-${salutation.value}`"
						name="salutationInternal"
						:native-value="salutation.label"
						v-model="formData.salutation.value"
						@input="$emit('field-changed', 'salutation')">
					{{ salutation.label }}
				</b-radio>
			</div>
			<span v-if="showError.salutation" class="help is-danger error-salutation"> {{ $t( 'donation_form_salutation_error' ) }}</span>
		</fieldset>
		<div class="form-input">
			<label for="title" class="subtitle">{{ $t( 'donation_form_academic_title_label' ) }}</label>
			<b-field>
			<b-select
					class="is-form-input"
					v-model="formData.title.value"
					id="title"
					name="title"
					@input="$emit('field-changed', 'title')">
				<option value="">{{ $t( 'donation_form_academic_title_option_none' ) }}</option>
				<option value="Dr.">Dr.</option>
				<option value="Prof.">Prof.</option>
				<option value="Prof. Dr.">Prof. Dr.</option>
			</b-select>
			</b-field>
		</div>
		<div v-bind:class="['form-input', { 'is-invalid': showError.firstName }]">
			<label for="first-name" class="subtitle">{{ $t( 'donation_form_firstname_label' ) }}</label>
			<b-field :type="{ 'is-danger': showError.firstName }">
				<b-input class="is-medium"
						type="text"
						id="first-name"
						v-model="formData.firstName.value"
						:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_firstname_placeholder' ) } )"
						autocomplete="given-name"
						@blur="$emit('field-changed', 'firstName')">
				</b-input>
			</b-field>
			<span v-if="showError.firstName" class="help is-danger error-first-name">{{ $t( 'donation_form_firstname_error' ) }}</span>
		</div>
		<div v-bind:class="['form-input', { 'is-invalid': showError.lastName }]">
			<label for="last-name" class="subtitle">{{ $t( 'donation_form_lastname_label' ) }}</label>
			<b-field :type="{ 'is-danger': showError.lastName }">
				<b-input type="text"
						id="last-name"
						v-model="formData.lastName.value"
						:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_lastname_placeholder' ) } )"
						autocomplete="family-name"
						@blur="$emit('field-changed', 'lastName')">
				</b-input>
			</b-field>
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
		<b-field :type="{ 'is-danger': showError.companyName }">
			<b-input type="text"
					id="company-name"
					:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_companyname_placeholder' ) } )"
					autocomplete="organization"
					v-model="formData.companyName.value"
					@blur="$emit('field-changed', 'companyName')">
			</b-input>
		</b-field>
		<span v-if="showError.companyName" class="help is-danger  error-company-name">{{ $t( 'donation_form_companyname_error' )  }}</span>
	</div>
</div>
</template>

<script lang="ts">
import Vue, { onMounted } from 'vue';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { AddressValidity, AddressFormData } from '@/view_models/Address';
import { computed } from 'vue';
import { Salutation } from '@/view_models/Salutation';
import { adjustSalutationLocaleIfNeeded } from '@/components/shared/SalutationLocaleAdjuster';
import ValueEqualsPlaceholderWarning from '@/components/shared/ValueEqualsPlaceholderWarning.vue';

export default Vue.extend( {
	name: 'name',
	components: { ValueEqualsPlaceholderWarning },
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
