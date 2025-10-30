<template>
	<RadioField
		v-if="showPersonalFields"
		name="salutation"
		:id="`${fieldIdNamespace}address-form-salutation`"
		v-model="formData.salutation.value"
		:label="$t( 'donation_form_salutation_label' )"
		:options="salutationFormOptions"
		:show-error="showError.salutation"
		:error-message="$t( 'donation_form_salutation_error' )"
		@field-changed="$emit('field-changed', 'salutation')"
		alignment="column"
		:is-max-width-field="true"
	/>

	<SelectField
		v-if="showPersonalFields"
		name="title"
		:id="`${fieldIdNamespace}address-form-title`"
		:input-id="`${fieldIdNamespace}title`"
		v-model="formData.title.value"
		:label="$t( 'donation_form_academic_title_label' )"
		:options="[
			{ label: $t( 'donation_form_academic_title_option_none' ), value: '' },
			{ label: 'Dr.', value: 'Dr.' },
			{ label: 'Prof.', value: 'Prof.' },
			{ label: 'Prof. Dr.', value: 'Prof. Dr.' },
		]"
		:is-max-width-field="true"
		@field-changed="$emit('field-changed', 'title')"
	/>

	<TextField
		v-if="showPersonalFields"
		name="firstName"
		:id="`${fieldIdNamespace}address-form-first-name`"
		:input-id="`${fieldIdNamespace}first-name`"
		v-model="formData.firstName.value"
		:show-error="showError.firstName"
		:error-message="$t( 'donation_form_firstname_error' )"
		autocomplete="given-name"
		:label="$t( 'donation_form_firstname_label' )"
		:placeholder="$t( 'donation_form_firstname_placeholder' )"
		:is-max-width-field="true"
		@field-changed="$emit('field-changed', 'firstName')"
	/>

	<TextField
		v-if="showPersonalFields"
		name="lastName"
		:id="`${fieldIdNamespace}address-form-last-name`"
		:input-id="`${fieldIdNamespace}last-name`"
		v-model="formData.lastName.value"
		:show-error="showError.lastName"
		:error-message="$t( 'donation_form_lastname_error' )"
		autocomplete="family-name"
		:label="$t( 'donation_form_lastname_label' )"
		:placeholder="$t( 'donation_form_lastname_placeholder' )"
		placeholder-warning="donation_form_lastname_placeholder_warning"
		:is-max-width-field="true"
		@field-changed="$emit('field-changed', 'lastName')"
	/>

	<TextField
		v-if="showCompanyFields"
		name="companyName"
		:id="`${fieldIdNamespace}address-form-company-name`"
		:input-id="`${fieldIdNamespace}company-name`"
		v-model="formData.companyName.value"
		:show-error="showError.companyName"
		:error-message="$t( 'donation_form_companyname_error' )"
		autocomplete="organization"
		:label="$t( 'donation_form_companyname_label' )"
		:placeholder="$t( 'donation_form_companyname_placeholder' )"
		:is-max-width-field="true"
		@field-changed="$emit('field-changed', 'companyName')"
	/>
</template>

<script setup lang="ts">

import type { Salutation } from '@src/view_models/Salutation';
import type { AddressFormData, AddressValidity } from '@src/view_models/Address';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import SelectField from '@src/components/shared/form_fields/SelectField.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed } from 'vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';

interface Props {
	addressType: AddressTypeModel;
	salutations: Salutation[];
	formData: AddressFormData;
	showError: AddressValidity;
	fieldIdNamespace?: string;
	addressTypesToShowPersonalFields?: AddressTypeModel[];
}

const props = withDefaults( defineProps<Props>(), {
	addressTypesToShowPersonalFields: () => [
		AddressTypeModel.PERSON,
		AddressTypeModel.EMAIL,
		AddressTypeModel.UNSET,
	],
} );
defineEmits( [ 'field-changed' ] );

const showPersonalFields = computed( () => props.addressTypesToShowPersonalFields.includes( props.addressType ) );
const showCompanyFields = computed( () => props.addressType === AddressTypeModel.COMPANY );
const fieldIdNamespace = props.fieldIdNamespace ? `${props.fieldIdNamespace}-` : '';
const salutationFormOptions: CheckboxFormOption[] = props.salutations.map( ( x, index ) => (
	{ value: x.value, label: x.label, id: `${ fieldIdNamespace }salutation-${ index }` }
) );

</script>
