<template>
	<div class="form-field form-field-incentives">
		<div class="option-checkbox">
			<CheckboxMultipleFormInput
				v-for="incentive in incentiveFormFieldOptions"
				:native-value="incentive.value"
				name="incentives"
				input-id="incentives"
				v-model="fieldModel"
				@update:modelValue="onUpdateModel"
				:input-id="incentive.id"
			>
				{{ incentive.label}}
			</CheckboxMultipleFormInput>
		</div>
	</div>
</template>

<script setup lang="ts">

import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import CheckboxMultipleFormInput from '@src/components/shared/form_elements/CheckboxMultipleFormInput.vue';
import { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';

interface Props {
	incentiveFormFieldOptions: CheckboxFormOption[];
	modelValue: string[];
}

const props = defineProps<Props>();

const emit = defineEmits( [ 'update:modelValue' ] );

const fieldModel = useFieldModel<string[]>( () => props.modelValue, props.modelValue );

const onUpdateModel = ( newValue: string[] ): void => {
	emit( 'update:modelValue', newValue );
};
</script>
