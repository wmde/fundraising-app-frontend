<template>
	<div class="control checkbox-multiple-form-input">
		<label
			ref="labelRef"
			class="checkbox"
			:class="{ 'is-disabled': disabled }"
			@click="focus"
			@keydown.prevent.enter="click"
		>
			<input
				v-model="inputModel"
				:value="nativeValue"
				type="checkbox"
				ref="inputRef"
				:name="name"
				:disabled="disabled"
				:required="required"
			/>
			<span class="check"/>
			<span class="control-label"><slot/></span>
		</label>
	</div>
</template>

<script setup lang="ts">
import { useInputFocusing } from '@src/components/shared/form_elements/useInputFocusing';
import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: Array<string | number>;
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
const inputModel = useInputModel<Array<string | number>>( () => props.modelValue, props.modelValue, emit );

</script>

<style scoped lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/forms';
@use 'sass:map';

$checkbox-size: map.get( units.$spacing, 'small' );

.checkbox-multiple-form-input {
	padding: 0 0 0 map.get( units.$spacing, 'medium' );

	input[type="checkbox"] {
		position: absolute;
		left: 0;
		opacity: 0;
		outline: none;
		z-index: -1;
	}

	.check {
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

	input[type="checkbox"]:checked + .check {
		background: colors.$primary forms.$checkbox-checkmark no-repeat center center;
		border-color: colors.$primary;
	}
}

</style>
