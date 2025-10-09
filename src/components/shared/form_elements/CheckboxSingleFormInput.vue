<template>
	<label>
		<input
			v-model="inputModel"
			:value="inputModel"
			type="checkbox"
			:name="name"
			:id="inputId"
			:disabled="disabled ? true : null"
			:aria-describedby="describedBy"
		/>
		<span><slot/></span>
	</label>
</template>

<script setup lang="ts">
import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: boolean | null;
	name: string;
	inputId: string;
	disabled?: boolean;
	describedBy?: string;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
} );
const emit = defineEmits( [ 'update:modelValue' ] );

const inputModel = useInputModel<boolean>( () => props.modelValue, props.modelValue, emit );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/forms';
@use 'sass:map';

$checkbox-size: map.get( units.$spacing, 'small' );

.checkbox-single-form-input {
	padding: 0 0 0 map.get( units.$spacing, 'medium' );

	input[type="checkbox"] {
		appearance: none;
		display: block;
		float: left;
		width: $checkbox-size;
		height: $checkbox-size;
		margin: 0 0 0 (-( map.get( units.$spacing, 'medium' ) ) );
		border-radius: 2px;
		border: 2px solid colors.$gray-dark;
		transition: background 150ms ease-out;
		background: transparent;
	}

	input[type="checkbox"]:checked {
		background: colors.$primary forms.$checkbox-checkmark no-repeat center center;
		border-color: colors.$primary;
	}
}
</style>
