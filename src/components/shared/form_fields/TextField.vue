<template>
	<div class="form-field form-field-text" :class="{ 'is-invalid': showError }">
		<label :for="inputId" class="form-field-label">
			{{ label }} <em v-if="labelHelpText">{{ labelHelpText }}</em>
		</label>
		<TextFormInput
			:name="name"
			:input-type="inputType"
			v-model="fieldModel"
			:input-id="inputId"
			:has-error="showError"
			:has-message="false"
			:placeholder="placeholder"
			:autocomplete="autocomplete"
			:disabled="disabled"
			:required="required"
			@blur="$emit('field-changed', name )"
			@update:modelValue="onUpdateModel"
		/>
		<span v-if="showError" class="help is-danger">{{ errorMessage }}</span>
		<slot name="message"/>
	</div>
</template>

<script setup lang="ts">

import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';

interface Props {
	inputType?: 'text'|'textarea';
	label: String;
	labelHelpText?: String;
	name: string;
	inputId: string;
	placeholder: string;
	modelValue: string|number;
	errorMessage: String;
	showError: boolean;
	disabled?: boolean;
	required?: boolean;
	autocomplete?: string;
}

const props = withDefaults( defineProps<Props>(), {
	inputType: 'text',
	disabled: false,
	required: false,
	autocomplete: 'on',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const fieldModel = useFieldModel<string | number>( () => props.modelValue, props.modelValue );

const onUpdateModel = ( newValue: string|number ): void => {
	emit( 'update:modelValue', newValue );
};

</script>

<style scoped lang="scss">

</style>
