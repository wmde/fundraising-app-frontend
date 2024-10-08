<template>
	<div
		class="radio radio-form-input"
		:class="{ 'is-disabled': disabled, 'is-active': inputModel === nativeValue }"
	>
		<input
			v-model="inputModel"
			type="radio"
			:name="name"
			:id="id"
			:class="inputClass"
			:value="nativeValue"
			:disabled="disabled"
			:required="required"
			:readonly="disabled"
			:aria-readonly="disabled"
			:aria-describedby="ariaDescribedby"
			:aria-invalid="ariaInvalid"
			:aria-disabled="disabled"
			:autofocus="autofocus"
			@blur="$emit( 'blur' )"
		/>
		<label class="control-label" :for="id" :class="labelClass" @blur="$emit( 'blur' )">
			<slot name="label"/>
			<slot name="help-text"/>
			<slot name="tooltip"/>
		</label>
	</div>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: string | number | boolean | null;
	nativeValue: string | number | boolean;
	name: string;
	id: string;
	inputClass?: string;
	labelClass?: string;
	disabled?: boolean;
	required?: boolean;
	ariaDescribedby?: string;
	ariaInvalid?: boolean;
	autofocus?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
	required: false,
	ariaDescribedby: '',
	ariaInvalid: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'blur' ] );

const inputModel = useInputModel<string | number | boolean | null>( () => props.modelValue, props.modelValue, emit );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/breakpoints';
@use '@src/scss/settings/forms';
@use 'sass:map';
@use 'sass:math';

$check-size: map.get( units.$spacing, 'small' );

.radio-form-input {
	flex: 0 0 auto;
	min-width: 106px;
	width: auto;
	line-height: 20px;

	&:last-child {
		margin: 0;
		flex: 0 0 auto;
	}

	input, input::before {
		position: absolute;
		top: 50%;
		margin-top: -( math.div( $check-size, 2 ) );
		width: $check-size;
		height: $check-size;
		border-radius: 50%;
	}

	input {
		appearance: none;
		display: block;
		left: map.get( units.$spacing, 'small' );
		box-sizing: border-box;
		cursor: pointer;
		transition: background 150ms ease-out;
		border-radius: 50%;
		border: 2px solid colors.$gray-dark;
		background: colors.$white;

		&::before {
			content: "";
			display: flex;
			left: 50%;
			margin-left: -( math.div( $check-size, 2 ) );
			background-color: colors.$primary;
			transform: scale( 0 );
			transition: transform 150ms ease-out;
		}
	}

	input:checked {
		border-color: colors.$primary;

		&::before {
			transform: scale( 0.5 );
		}
	}

	label {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		border: 1px solid colors.$gray-mid;
		border-radius: map.get( forms.$input, 'border-radius' );
		padding: map.get( units.$spacing, 'x-small' ) map.get( units.$spacing, 'small' );
		cursor: pointer;
	}

	label:hover,
	input:focus + label,
	input:hover + label {
		border: 1px solid colors.$primary;

		.radio-field-tooltip-text {
			visibility: visible;
			opacity: 1;
		}
	}

	&.is-disabled {
		label {
			border-color: colors.$gray-light;
			color: colors.$gray-mid;
			cursor: not-allowed;
		}

		input {
			border-color: colors.$gray-mid;
		}
	}

	&.is-active {
		border: 0;

		label {
			border-color: colors.$primary;
		}
	}
}

.is-invalid {
	.radio-form-input label {
		border-color: colors.$error;
	}
}

</style>
