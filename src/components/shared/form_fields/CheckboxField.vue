<template>
	<FieldContainer :input-id="inputId" :is-max-width-field="isMaxWidthField">
		<template #field>
			<CheckboxSingleFormInput
				v-model="fieldModel"
				:name="name"
				:input-id="inputId"
				:disabled="disabled"
				:ariaDescribedby="ariaDescribedby"
				@update:modelValue="onFieldChange"
			>
				<slot/>
			</CheckboxSingleFormInput>
		</template>
	</FieldContainer>
</template>

<script setup lang="ts">
import CheckboxSingleFormInput from '@src/components/shared/form_elements/CheckboxSingleFormInput.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';

interface Props {
	name: string;
	inputId: string;
	modelValue: boolean;
	disabled?: boolean;
	required?: boolean;
	ariaDescribedby?: string;
	isMaxWidthField?: boolean;
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
