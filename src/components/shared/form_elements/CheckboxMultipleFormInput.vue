<template>
	<div class="control checkbox-multiple-form-input">
		<div class="checkbox" :class="{ 'is-disabled': disabled }">
			<input
				v-model="inputModel"
				:value="nativeValue"
				type="checkbox"
				:name="name"
				:id="inputId"
				:disabled="disabled"
				:required="required"
			/>
			<label class="control-label" :for="inputId"><slot/></label>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: Array<string | number>;
	nativeValue: string | number | boolean;
	name: string;
	inputId: string;
	disabled?: boolean;
	required?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue' ] );

const inputModel = useInputModel<Array<string | number>>( () => props.modelValue, props.modelValue, emit );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/forms';
@use 'sass:map';

$checkbox-size: map.get( units.$spacing, 'small' );

.checkbox-multiple-form-input {
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
