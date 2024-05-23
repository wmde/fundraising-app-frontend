<template>
	<div class="form-field form-field-select" :class="{ 'is-invalid': showError }">
		<label :for="inputId" class="form-field-label">{{ label }}</label>
		<SelectFormInput
			v-model="fieldModel"
			:select-id="inputId"
			:name="name"
			:has-error="showError"
			@update:modelValue="onFieldChange"
		>
			<option v-for="( option, index ) in options" :key="index" :value="option.value">
				{{ option.label }}
			</option>
		</SelectFormInput>
		<span v-if="showError" class="help is-danger">{{ errorMessage }}</span>
	</div>
</template>

<script setup lang="ts">

import { SelectFormOption } from '@src/components/shared/form_fields/FormOptions';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import SelectFormInput from '@src/components/shared/form_elements/SelectFormInput.vue';

interface Props {
	label: String;
	name: string;
	inputId: string;
	modelValue: string|number;
	options: SelectFormOption[];
	errorMessage?: String;
	showError?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const fieldModel = useFieldModel<string | number>( () => props.modelValue, props.modelValue );

const onFieldChange = ( newValue: string | number ): void => {
	emit( 'update:modelValue', newValue );
	emit( 'field-changed', props.name );
};

</script>

<style lang="scss">
.form-field-select {
	.select:not( .is-multiple ) {
		height: auto;
	}
}
</style>
