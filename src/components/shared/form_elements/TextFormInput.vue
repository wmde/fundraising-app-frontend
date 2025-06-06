<template>
	<div class="control text-form-input" :class="{ 'has-icons-right': hasError || hasMessage, 'is-disabled': disabled }">
		<input
			v-if="inputType === 'text'"
			:name="name"
			v-model="inputModel"
			class="input"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
			type="text"
			:autocomplete="autocomplete"
			:autofocus="autofocus"
			:placeholder="placeholder"
			:disabled="disabled"
			:required="required"
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
			class="textarea"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
			:autocomplete="autocomplete"
			:autofocus="autofocus"
			:placeholder="placeholder"
			:disabled="disabled"
			:required="required"
			:aria-invalid="hasError"
			:aria-describedby="ariaDescribedby"
			@blur="onBlur"
			@focus="onFocus"
			@input="onInput"
		/>
		<span v-if="hasError" class="icon is-right has-text-danger">
			<i class="mdi mdi-alert-circle mdi-24px"></i>
		</span>
		<span v-if="hasMessage" class="icon is-right has-text-warning">
			<i class="mdi mdi-alert mdi-24px"></i>
		</span>
	</div>
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
	required?: boolean;
	ariaDescribedby?: string;
	ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
}

const props = withDefaults( defineProps<Props>(), {
	autocomplete: 'on',
	hasError: false,
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur', 'input' ] );

const inputModel = useInputModel<string | number>( () => props.modelValue, props.modelValue, emit );

const onFocus = ( event: Event ): void => emit( 'focus', event );
const onBlur = ( event: Event ): void => emit( 'blur', event );
const onInput = ( event: Event ): void => emit( 'input', event );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/forms';
@use 'sass:map';

.text-form-input {
	input,
	textarea {
		border: map.get( forms.$input, 'border' );
		font-size: map.get( forms.$input, 'font-size' );
		border-radius: map.get( forms.$input, 'border-radius' );
		height: map.get( forms.$input, 'height' );

		&:active {
			background-color: colors.$white;
		}

		&:focus {
			border-color: map.get( forms.$input, 'border-focus-color' );
		}
	}

	input {
		padding: 0 map.get( units.$spacing, 'small' );
	}

	textarea {
		padding: map.get( units.$spacing, 'small' );
	}

	&.has-icons-right .icon {
		height: 40px;
	}
}

.is-invalid {
	.text-form-input input,
	.text-form-input textarea {
		border-color: map.get( forms.$input, 'border-error-color' );

		&:focus {
			border-color: map.get( forms.$input, 'border-focus-color' );
			box-shadow: none;
		}
	}
}
</style>
