<template>
	<input
		v-if="inputType === 'text'"
		:name="name"
		v-model="inputModel"
		:id="inputId"
		type="text"
		:autocomplete="autocomplete"
		:autofocus="autofocus"
		:placeholder="placeholder"
		:disabled="disabled ? true : null"
		:aria-invalid="hasError"
		:aria-describedby="ariaDescribedby"
		:aria-autocomplete="ariaAutocomplete"
		@blur="onBlur"
		@focus="onFocus"
		@input="onInput"
	/>
	<textarea
		v-if="inputType === 'textarea'"
		:name="name"
		v-model="inputModel"
		:id="inputId"
		:autocomplete="autocomplete"
		:autofocus="autofocus"
		:placeholder="placeholder"
		:disabled="disabled ? true : null"
		:aria-invalid="hasError"
		:aria-describedby="ariaDescribedby"
		@blur="onBlur"
		@focus="onFocus"
		@input="onInput"
	/>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	inputType: 'text' | 'textarea';
	name: string;
	modelValue: string | number;
	autocomplete?: string;
	autofocus?: boolean;
	inputId: string;
	placeholder: string;
	hasMessage: boolean;
	hasError?: boolean;
	disabled?: boolean;
	ariaDescribedby?: string | undefined;
	ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
}

const props = withDefaults( defineProps<Props>(), {
	autocomplete: 'on',
	hasError: false,
	disabled: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur', 'input', 'keyup', 'keydown' ] );

const inputModel = useInputModel<string | number>( () => props.modelValue, props.modelValue, emit );

const onFocus = ( event: Event ): void => emit( 'focus', event );
const onBlur = ( event: Event ): void => emit( 'blur', event );
const onInput = ( event: Event ): void => emit( 'input', event );

</script>
