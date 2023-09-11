<template>
	<fieldset class="form-field form-field-radio" :class="{ 'is-invalid': showError }">
		<legend class="form-field-label">{{ label }}</legend>
		<div class="form-field-radio-container">
			<RadioFormInput
				v-for="option in options"
				:key="option.value"
				:class="{ 'is-active': modelValue === option.value }"
				:id="`${name}-${option.value}`"
				:name="name"
				:disabled="disabled.includes( option.value )"
				:required="required"
				:native-value="option.value"
				v-model="fieldModel"
				@update:modelValue="onFieldChange"
			>
				{{ option.label }}
			</RadioFormInput>
		</div>
		<span v-if="showError" class="help is-danger">{{ errorMessage }}</span>
	</fieldset>
</template>

<script setup lang="ts">
import { FormOption } from '@src/components/shared/form_fields/FormOption';
import RadioFormInput from '@src/components/shared/form_inputs/RadioFormInput.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';

interface Props {
	label: String;
	name: string;
	modelValue: string|number;
	options: FormOption[];
	disabled?: string[];
	required?: boolean;
	errorMessage: String;
	showError?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: () => [],
	required: false,
	showError: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const fieldModel = useFieldModel<string | number>( () => props.modelValue, props.modelValue );

const onFieldChange = ( newValue: string | number ): void => {
	emit( 'update:modelValue', newValue );
	emit( 'field-changed', props.name );
};

</script>

<style lang="scss">

</style>
