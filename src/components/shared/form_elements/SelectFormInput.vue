<template>
	<select
		v-model="inputModel"
		:name="name"
		:id="selectId"
		:disabled="disabled"
		:class="{ 'is-danger': hasError }"
		:aria-invalid="hasError"
		:aria-describedby="ariaDescribedby"
	>
		<slot/>
	</select>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: string | number;
	name: string;
	selectId: string;
	hasError?: boolean;
	disabled?: boolean;
	required?: boolean;
	ariaDescribedby?: string;
}

const props = withDefaults( defineProps<Props>(), {
	hasError: false,
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur' ] );

const inputModel = useInputModel<string | number>( () => props.modelValue, props.modelValue, emit );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/forms';
@use 'sass:map';

.select-form-input {
	.select {
		width: 100%;

		select {
			border: map.get( forms.$input, 'border' );
			border-radius: map.get( forms.$input, 'border-radius' );
			width: 100%;
			padding: 0 map.get( units.$spacing, 'x-large' ) 0 map.get( units.$spacing, 'small' );
			font-size: map.get( forms.$input, 'font-size' );
			height: map.get( forms.$input, 'height' );

			&:focus {
				border-color: map.get( forms.$input, 'border-focus-color' );
			}
		}
	}

	.select:not(.is-multiple):not(.is-loading)::after {
		width: 1em;
		height: 1em;
		margin-top: -0.6em;
	}
}

.is-invalid {
	.select-form-input select {
		border-color: map.get( forms.$input, 'border-error-color' );

		&:focus {
			border-color: map.get( forms.$input, 'border-focus-color' );
		}
	}
}

</style>
