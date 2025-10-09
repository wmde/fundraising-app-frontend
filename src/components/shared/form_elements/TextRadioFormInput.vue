<template>
	<div class="text-radio" :data-direction="$i18n.locale === 'de-DE' ? 'rtl' : null">
		<span class="text-radio__radio" :class="{ 'text-radio__radio--checked': radioChecked }" @click="onClickRadio" aria-hidden="true"></span>
		<input
			:name="name"
			v-model="inputModel"
			ref="customInput"
			class="text-radio__text"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
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
		<span class="text-radio__currency">€</span>
	</div>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_elements/useInputModel';
import { ref } from 'vue';

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
const customInput = ref<HTMLInputElement>( null );
const inputModel = useInputModel<string | number>( () => props.modelValue, props.modelValue, emit );

const onFocus = ( event: Event ): void => emit( 'focus', event );
const onBlur = ( event: Event ): void => emit( 'blur', event );
const onInput = ( event: Event ): void => emit( 'input', event );
const onClickRadio = () => {
	customInput.value.focus();
	emit( 'radioClicked' );
};
</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/forms';
@use 'sass:map';
@use 'sass:math';

$check-size: map.get( units.$spacing, 'small' );

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
	display: block;
	box-sizing: border-box;
	cursor: pointer;
	transition: background 150ms ease-out;
	border-radius: 50%;
	border: 2px solid colors.$gray-dark;
	background: colors.$white;

	&::before {
		position: absolute;
		content: "";
		display: flex;
		width: $check-size;
		height: $check-size;
		border-radius: 50%;
		left: 50%;
		top: 50%;
		margin-top: -( math.div( $check-size, 2 ) );
		margin-left: -( math.div( $check-size, 2 ) );
		background-color: colors.$primary;
		transform: scale( 0 );
		transition: transform 150ms ease-out;
	}

	&.checked {
		border-color: colors.$primary;

		&::before {
			transform: scale( 0.5 );
		}
	}
}

</style>
