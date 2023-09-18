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
			:placeholder="placeholder"
			:disabled="disabled"
			:required="required"
			@blur="onBlur"
			@focus="onFocus"
		/>
		<textarea
			v-if="inputType === 'textarea'"
			:name="name"
			v-model="inputModel"
			class="textarea"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
			:autocomplete="autocomplete"
			:placeholder="placeholder"
			:disabled="disabled"
			:required="required"
			@blur="onBlur"
			@focus="onFocus"
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
	inputId: string;
	placeholder: String;
	hasMessage: boolean;
	hasError?: boolean;
	disabled?: boolean;
	required?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	autocomplete: 'on',
	hasError: false,
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur' ] );

const inputModel = useInputModel<string | number>( () => props.modelValue, props.modelValue, emit );

const onFocus = ( event: Event ): void => emit( 'focus', event );
const onBlur = ( event: Event ): void => emit( 'blur', event );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/forms';
@use 'sass:map';

.text-form-input {
	input {
		border-radius: map.get( forms.$input, 'border-radius' );
		padding: 0 map.get( units.$spacing, 'small' );
	}

	&.has-icons-right .icon {
		height: 44px;
	}
}
</style>
