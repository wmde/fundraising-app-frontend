<template>
	<div class="form-field" :class="[ 'form-field-text', { 'is-invalid': showError } ]">
		<label :for="inputId" class="form-field-label">
			{{ label }} <em v-if="labelHelpText">{{ labelHelpText }}</em>
		</label>
		<div v-if="helpText" class="form-field-help-text" :id="`${inputId}-help-text`">
			{{ helpText }}
		</div>
		<div class="control text-form-input" :class="{ 'has-icons-right': showError, 'is-disabled': disabled }">
			<input
				ref="field"
				:name="name"
				:value="value"
				class="input"
				:id="inputId"
				:class="{ 'is-danger': showError }"
				type="text"
				:autocomplete="autocomplete"
				:autofocus="autofocus"
				:placeholder="placeholder"
				:disabled="disabled"
				:required="required"
				:aria-invalid="showError"
				:aria-describedby="ariaDescribedby"
				@blur="$emit('field-changed', name )"
				@input="onInput"
				@paste="onInput"
			/>
		</div>
		<span v-if="showError" class="help is-danger" :id="`${inputId}-error`">{{ errorMessage }}</span>
		<span class="field-info-message">
			<slot name="message"/>
		</span>
	</div>
</template>

<script setup lang="ts">

// This field should be used when you need to format the value as the donor inputs.
// We can't use the normal TextField for this because formatting the model value
// causes an event loop so instead we use the native HTML input value. It also
// contains functionality for externally updating the cursor position, because
// when we change the value of an input field the browser jumps the cursor to
// the end. We need to reset it to the proper position to allow the donor to
// edit the field properly. It's up to the external formatter to decided that
// position.

import { computed, ref, watch } from 'vue';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';

interface Props {
	label: String;
	labelHelpText?: String;
	helpText?: String;
	name: string;
	inputId: string;
	placeholder: string;
	value: string;
	errorMessage: String;
	showError: boolean;
	cursorPosition?: number;
	disabled?: boolean;
	required?: boolean;
	autocomplete?: string;
	autofocus?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	cursorPosition: 0,
	disabled: false,
	required: false,
	autocomplete: 'on',
} );
const emit = defineEmits( [ 'field-changed', 'input' ] );
const field = ref<HTMLInputElement>( null );

const ariaDescribedby = useAriaDescribedby(
	computed<string>( () => ( props.helpText ? `${ props.inputId }-help-text` : '' ) ),
	`${props.inputId}-error`,
	computed<boolean>( () => props.showError )
);

const onInput = async () => {
	emit( 'input', field.value.value, field.value.selectionStart );
};

watch( () => props.cursorPosition, ( newCursorPosition: number ) => {
	if ( newCursorPosition === field.value.selectionStart ) {
		return;
	}

	field.value.setSelectionRange( newCursorPosition, newCursorPosition );
} );

</script>

<style lang="scss">
@use '@src/scss/settings/colors';

.field-info-message {
	color: colors.$gray-dark;
}

</style>
