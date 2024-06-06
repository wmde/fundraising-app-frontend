<template>
	<div class="control select-form-input" :class="{ 'is-disabled': disabled }">
		<span class="select">
			<select
				v-model="inputModel"
				:name="name"
				:id="selectId"
				:disabled="disabled"
				:required="required"
				:class="{ 'is-danger': hasError }"
			>
                <slot/>
			</select>
		</span>
	</div>
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
// TODO: Replace this with custom breakpoint mixins in scss/settings/_breakpoints.scss
@import "~bulma/sass/utilities/mixins";

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
	}
}

</style>
