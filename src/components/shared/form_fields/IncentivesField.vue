<template>
	<FieldContainer input-id="tote_bag">
		<template #field>
			<CheckboxMultipleFormInput
				v-for="incentive in incentiveFormFieldOptions"
				:key="incentive.id"
				:native-value="incentive.value"
				name="incentives"
				v-model="fieldModel"
				@update:modelValue="onUpdateModel"
				:input-id="incentive.id"
			>
				{{ incentive.label}}
			</CheckboxMultipleFormInput>
		</template>
	</FieldContainer>
</template>

<script setup lang="ts">

import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import CheckboxMultipleFormInput from '@src/components/shared/form_elements/CheckboxMultipleFormInput.vue';
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';

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
