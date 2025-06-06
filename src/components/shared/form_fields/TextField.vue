<template>
	<div class="form-field" :class="[ `form-field-${inputType}`, { 'is-invalid': showError } ]">
		<label :for="inputId" class="form-field-label">
			{{ label }} <em v-if="labelHelpText">{{ labelHelpText }}</em>
		</label>
		<div v-if="helpText" class="form-field-help-text" :id="`${inputId}-help-text`">
			{{ helpText }}
		</div>
		<TextFormInput
			:name="name"
			:input-type="inputType"
			v-model="fieldModel"
			:input-id="inputId"
			:has-error="showError"
			:has-message="false"
			:placeholder="placeholder"
			:autocomplete="autocomplete"
			:disabled="disabled"
			:required="required"
			:autofocus="autofocus"
			:aria-describedby="ariaDescribedby"
			@blur="$emit('field-changed', name )"
			@input="onInput"
			@update:modelValue="onUpdateModel"
		/>
		<span v-if="showError" class="help is-danger" :id="`${inputId}-error`">{{ errorMessage }}</span>
		<span class="field-info-message">
			<slot name="message"/>
		</span>
	</div>
</template>

<script setup lang="ts">

import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { computed } from 'vue';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';

interface Props {
	inputType?: 'text' | 'textarea';
	label: String;
	labelHelpText?: String;
	helpText?: String;
	name: string;
	inputId: string;
	placeholder: string;
	modelValue: string | number;
	errorMessage: String;
	showError: boolean;
	disabled?: boolean;
	required?: boolean;
	autocomplete?: string;
	autofocus?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	inputType: 'text',
	disabled: false,
	required: false,
	autocomplete: 'on',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const fieldModel = useFieldModel<string | number>( () => props.modelValue, props.modelValue );
const ariaDescribedby = useAriaDescribedby(
	computed<string>( () => ( props.helpText ? `${ props.inputId }-help-text` : '' ) ),
	`${props.inputId}-error`,
	computed<boolean>( () => props.showError )
);

const onInput = (): void => {
	if ( props.showError ) {
		emit( 'field-changed', props.name );
	}
};

const onUpdateModel = ( newValue: string | number ): void => {
	emit( 'update:modelValue', newValue );
};

</script>

<style lang="scss">
@use '@src/scss/settings/colors';

.field-info-message {
	color: colors.$gray-dark;
}

</style>
