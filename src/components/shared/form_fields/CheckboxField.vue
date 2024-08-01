<template>
	<div class="form-field form-field-checkbox">
		<CheckboxSingleFormInput
			v-model="fieldModel"
			:name="name"
			:input-id="inputId"
			:disabled="disabled"
			:required="required"
			:ariaDescribedby="ariaDescribedby"
			@update:modelValue="onFieldChange"
		>
			<slot/>
		</CheckboxSingleFormInput>
	</div>
</template>

<script setup lang="ts">
import CheckboxSingleFormInput from '@src/components/shared/form_elements/CheckboxSingleFormInput.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';

interface Props {
	name: string;
	inputId: string;
	modelValue: boolean;
	disabled?: boolean;
	required?: boolean;
	ariaDescribedby?: string;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
	required: false,
	ariaDescribedby: '',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const fieldModel = useFieldModel<boolean>( () => props.modelValue, props.modelValue );

const onFieldChange = ( newValue: boolean ): void => {
	emit( 'update:modelValue', newValue );
	emit( 'field-changed', props.name );
};

</script>
