<template>
	<div class="name-section">
		<ScrollTarget :target-id="`${fieldIdNamespace}salutation-scroll-target`"/>
		<RadioField
			v-if="showPersonalFields"
			name="salutation"
			v-model="formData.salutation.value"
			:label="$t( 'donation_form_salutation_label' )"
			:options="salutationFormOptions"
			:show-error="showError.salutation"
			:error-message="$t( 'donation_form_salutation_error' )"
			@field-changed="$emit('field-changed', 'salutation')"
			alignment="column"
		/>

		<ScrollTarget :target-id="`${fieldIdNamespace}title-scroll-target`"/>
		<SelectField
			v-if="showPersonalFields"
			name="title"
			:input-id="`${fieldIdNamespace}title`"
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

		<ScrollTarget :target-id="`${fieldIdNamespace}first-name-scroll-target`"/>
		<TextField
			v-if="showPersonalFields"
			name="firstName"
			:input-id="`${fieldIdNamespace}first-name`"
			v-model="formData.firstName.value"
			:show-error="showError.firstName"
			:error-message="$t( 'donation_form_firstname_error' )"
			autocomplete="given-name"
			:label="$t( 'donation_form_firstname_label' )"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_firstname_placeholder' ) } )"
			@field-changed="$emit('field-changed', 'firstName')"
		/>

		<ScrollTarget :target-id="`${fieldIdNamespace}last-name-scroll-target`"/>
		<TextField
			v-if="showPersonalFields"
			name="lastName"
			:id="`${fieldIdNamespace}last-name-container`"
			:input-id="`${fieldIdNamespace}last-name`"
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

		<ScrollTarget :target-id="`${fieldIdNamespace}company-name-scroll-target`"/>
		<TextField
			v-if="showCompanyFields"
			name="companyName"
			:input-id="`${fieldIdNamespace}company-name`"
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

import type { Salutation } from '@src/view_models/Salutation';
import type { AddressFormData, AddressValidity } from '@src/view_models/Address';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import SelectField from '@src/components/shared/form_fields/SelectField.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { computed } from 'vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';

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
