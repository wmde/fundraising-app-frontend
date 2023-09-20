<template>
	<div class="form-field form-field-select">
		<label :for="name" class="form-field-label">{{ label }}</label>
		<SelectFormInput
			v-model="fieldModel"
			:select-id="name"
			:name="name"
			@update:modelValue="onFieldChange"
		>
			<option v-for="( option, index ) in options" :key="index" :value="option.value">
				{{ option.label }}
			</option>
		</SelectFormInput>
	</div>
</template>

<script setup lang="ts">

import { FormOption } from '@src/components/shared/form_elements/FormOption';
import { useFieldModel } from '@src/components/shared/form_elements/useFieldModel';
import SelectFormInput from '@src/components/shared/form_inputs/SelectFormInput.vue';

interface Props {
	label: String;
	name: string;
	modelValue: string|number;
	options: FormOption[];
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
