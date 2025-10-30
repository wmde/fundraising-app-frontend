<template>
	<FieldContainer :input-id="name" :show-error="showError" type="fieldset" :is-max-width-field="isMaxWidthField">
		<template #label>{{ label }}</template>
		<template #field>
			<div :class="layoutType" :data-layout="gridLayout">
				<RadioFormInput
					v-for="( option, index ) in options"
					:key="index"
					:id="option.id"
					:name="name"
					:disabled="disabled.includes( option.value )"
					:native-value="option.value"
					:aria-describedby="ariaDescribedby"
					:aria-invalid="showError"
					v-model="fieldModel"
					:autofocus="autofocus"
					@update:modelValue="onFieldChange"
				>
					<template #label>
						{{ option.label }}
					</template>
					<template #help-text>
						<slot :name="`message-${option.value}`"/>
					</template>
					<template #tooltip>
						<slot :name="`tooltip-${option.value}`"/>
					</template>
				</RadioFormInput>
			</div>
		</template>
		<template #error>
			{{ errorMessage }}
		</template>
	</FieldContainer>
</template>

<script setup lang="ts">
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { computed } from 'vue';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';

interface Props {
	label?: String;
	name: string;
	modelValue: string | number | boolean | null;
	options: CheckboxFormOption[];
	disabled?: Array<string | number | boolean>;
	showError?: boolean;
	errorMessage?: String;
	layoutType?: 'cluster' | 'grid';
	gridLayout?: 'full' | '50-50' | 'halves' | 'thirds' | 'quarters';
	autofocus?: boolean;
	ariaDescribedby?: string;
	isMaxWidthField?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: () => [],
	layoutType: 'grid',
	gridLayout: 'full',
	showError: false,
	ariaDescribedby: '',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const ariaDescribedby = useAriaDescribedby(
	props.name,
	computed<boolean>( () => false ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => false )
);

const fieldModel = useFieldModel<string | number | boolean | null>( () => props.modelValue, props.modelValue );

const onFieldChange = ( newValue: string | number | boolean | null ): void => {
	emit( 'update:modelValue', newValue );
	emit( 'field-changed', props.name );
};

</script>
