<template>
	<div class="control text-form-input text-radio-form-input" :class="[ `locale-${ $i18n.locale }`, { 'has-icons-right': hasError || hasMessage, 'is-disabled': disabled } ]">
		<input
			name="amount"
			type="radio"
			class="text-radio-form-input-radio"
			@click="$emit( 'radioClicked' )"
			:checked="radioChecked"
			aria-hidden="true"
			tabindex="-1"
		/>
		<input
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
	</div>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	name: string;
	modelValue: string | number;
	autocomplete?: string;
	autofocus?: boolean;
	inputId: string;
	placeholder: string;
	hasMessage: boolean;
	radioChecked: boolean;
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
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur', 'input', 'radioClicked' ] );

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

.text-radio-form-input {
	position: relative;

	.input[type="text"] {
		padding: 0 map.get( units.$spacing, 'medium' ) 0 map.get( units.$spacing, 'xx-large' );
		text-align: right;
	}

	&.locale-en-GB {
		.input[type="text"] {
			text-align: left;
		}

		&:after {
			right: auto;
			left: 44px;
		}
	}
}

.text-radio-form-input-radio {
	position: absolute;
	z-index: 1;
	height: 16px;
	width: 16px;
	min-width: 16px;
	top: 50%;
	transform: translateY( -50% );
	left: 16px;

	input {
		padding: 0;
		top: 0;
		margin-top: 0;
		left: 0;
	}
}

</style>
