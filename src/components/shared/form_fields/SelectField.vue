<template>
	<FieldContainer :input-id="inputId" :show-error="showError">
		<template #label>{{ label }}</template>
		<template #field>
			<SelectFormInput
				v-model="fieldModel"
				:select-id="inputId"
				:name="name"
				:has-error="showError"
				:aria-describedby="ariaDescribedby"
				@update:modelValue="onFieldChange"
			>
				<option v-for="( option, index ) in options" :key="index" :value="option.value">
					{{ option.label }}
				</option>
			</SelectFormInput>
		</template>
		<template #error>{{ errorMessage }}</template>
	</FieldContainer>
</template>

<script setup lang="ts">

import type { SelectFormOption } from '@src/components/shared/form_fields/FormOptions';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import SelectFormInput from '@src/components/shared/form_elements/SelectFormInput.vue';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';
import { computed } from 'vue';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';

interface Props {
	label: String;
	name: string;
	inputId: string;
	modelValue: string | number;
	options: SelectFormOption[];
	errorMessage?: String;
	showError?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const fieldModel = useFieldModel<string | number>( () => props.modelValue, props.modelValue );
const ariaDescribedby = useAriaDescribedby(
	props.inputId,
	computed<boolean>( () => false ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => false )
);

const onFieldChange = ( newValue: string | number ): void => {
	emit( 'update:modelValue', newValue );
	emit( 'field-changed', props.name );
};

</script>
