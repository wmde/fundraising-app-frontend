<template>
	<label
		ref="labelRef"
		class="radio radio-form-input"
		:class="{ 'is-disabled': disabled }"
		@click="focus"
		@keydown.prevent.enter="click"
	>
		<input
			v-model="inputModel"
			type="radio"
			ref="inputRef"
			:name="name"
			:value="nativeValue"
			:disabled="disabled"
			:required="required"
		/>
		<span class="check"/>
		<span class="control-label"><slot/></span>
	</label>
</template>

<script setup lang="ts">

import { useInputFocusing } from '@src/components/shared/form_inputs/useInputFocusing';
import { useInputModel } from '@src/components/shared/form_inputs/useInputModel';

interface Props {
	modelValue: string | number | boolean | null;
	nativeValue: string | number | boolean;
	name: string;
	disabled?: boolean;
	required?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue' ] );

const { labelRef, inputRef, focus, click } = useInputFocusing();
const inputModel = useInputModel<string | number | boolean | null>( () => props.modelValue, props.modelValue, emit );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use 'sass:map';
@use 'sass:math';

$check-size: map.get( units.$spacing, 'small' );

.radio-form-input {
	flex: 0 0 auto;
	margin: 0 map.get( units.$spacing, 'large' ) 0 0;
	padding: map.get( units.$spacing, 'small' ) 0;
	width: map.get( units.$spacing, 'xxx-large' );
	line-height: map.get( units.$spacing, 'small' );

	&:last-child {
		margin: 0;
		flex: 1 0 auto;
	}

	.check {
		display: block;
		float: left;
		box-sizing: border-box;
		position: relative;
		cursor: pointer;
		width: $check-size;
		height: $check-size;
		margin-right: math.div( $check-size, 2 );
		transition: background 150ms ease-out;
		border-radius: 50%;
		border: 2px solid colors.$gray-dark;

		&::before {
			content: "";
			display: flex;
			position: absolute;
			left: 50%;
			margin-left: -( math.div( $check-size, 2 ) );
			top: 50%;
			margin-top: -( math.div( $check-size, 2 ) );
			width: $check-size;
			height: $check-size;
			border-radius: 50%;
			background-color: colors.$primary;
			transform: scale( 0 );
			transition: transform 150ms ease-out;
		}
	}

	input {
		position: absolute;
		left: 0;
		opacity: 0;
		outline: none;
		z-index: -1;
	}

	input:checked + .check {
		border-color: colors.$primary;

		&::before {
			transform: scale( 0.5 );
		}
	}
}
</style>
