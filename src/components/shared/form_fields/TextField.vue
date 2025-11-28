<template>
	<FieldContainer :input-id="inputId" :show-error="showError" :is-max-width-field="isMaxWidthField">
		<template #label>
			{{ label }} <em v-if="labelHelpText">{{ labelHelpText }}</em>
		</template>
		<template v-if="helpText" #help-text>
			{{ helpText }}
		</template>
		<template #field>
			<TextFormInput
				:name="name"
				:input-type="inputType"
				v-model="fieldModel"
				:input-id="inputId"
				:has-error="showError"
				:has-message="false"
				:placeholder="placeholderText"
				:autocomplete="autocomplete"
				:disabled="disabled"
				:autofocus="autofocus"
				:aria-describedby="ariaDescribedby"
				@blur="$emit('field-changed', name )"
				@input="onInput"
				@update:modelValue="onUpdateModel"
			/>
		</template>
		<template #error>{{ errorMessage }}</template>
		<template #message v-if="valueEqualsPlaceholderWarning.hasWarning.value">{{ valueEqualsPlaceholderWarning.warning }}</template>
		<template #message v-else-if="$slots.message"><slot name="message"/></template>
	</FieldContainer>
</template>

<script setup lang="ts">

import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { computed, useSlots } from 'vue';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';
import { useValueEqualsPlaceholderWarning } from '@src/components/shared/composables/useValueEqualsPlaceholderWarning';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';
import { useI18n } from 'vue-i18n';

interface Props {
	inputType?: 'text' | 'textarea';
	label: String;
	labelHelpText?: String;
	helpText?: String;
	name: string;
	inputId: string;
	placeholder: string;
	placeholderWarning?: string;
	modelValue: string | number;
	errorMessage: String;
	showError: boolean;
	disabled?: boolean;
	autocomplete?: string;
	autofocus?: boolean;
	isMaxWidthField?: boolean;
	ariaDescribedby?: string | undefined;
}

const props = withDefaults( defineProps<Props>(), {
	inputType: 'text',
	disabled: false,
	autocomplete: 'on',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );
const slots = useSlots();
const { t } = useI18n();

const fieldModel = useFieldModel<string | number>( () => props.modelValue, props.modelValue );
const valueEqualsPlaceholderWarning = useValueEqualsPlaceholderWarning( fieldModel, props.placeholder, props.placeholderWarning );
const ariaDescribedby = useAriaDescribedby(
	props.inputId,
	computed<boolean>( () => !!props.helpText ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => valueEqualsPlaceholderWarning.hasWarning.value || !!slots.message ),
	computed<string | undefined>( () => props.ariaDescribedby )
);

const placeholderText = computed( (): string => {
	if ( props.placeholder ) {
		return t( 'form_for_example', { example: props.placeholder } );
	}
	return '';
} );

const onInput = (): void => {
	if ( props.showError ) {
		emit( 'field-changed', props.name );
	}
};

const onUpdateModel = ( newValue: string | number ): void => {
	emit( 'update:modelValue', newValue );
};

</script>
